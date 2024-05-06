/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import webcam from "/assets/webcam.svg";
import webcamoff from "/assets/webcamoff.svg";
import micmute from "/assets/micmute.svg";
import micunmute from "/assets/micunmute.svg";

interface VideoCallProps {
  socket: any;
  room: string;
  showVideo: any;
}

type PeerRefType = {
  peerID: string;
  peer: Peer.Instance;
};

export default function VideoCall({ socket, room }: VideoCallProps) {
  const userVideo = useRef<HTMLVideoElement | null>(null);

  const [peers, setPeers] = useState<PeerRefType[]>([]);
  const [userUpdate, setUserUpdate] = useState<any[]>([]);
  const peersRef = useRef<PeerRefType[]>([]);

  const [audioFlag, setAudioFlag] = useState(true);
  const [videoFlag, setVideoFlag] = useState(true);

  const handleVideo = () => {
    if (!userVideo.current) return;
    if (userVideo.current.srcObject) {
      (userVideo.current.srcObject as MediaStream).getTracks().forEach(function (track: any) {
        if (track.kind === "video") {
          // if (track.enabled) {
          socket.emit("change", [
            ...userUpdate,
            {
              id: socket.id,
              videoFlag: !videoFlag,
              audioFlag,
            },
          ]);
          track.enabled = !videoFlag;
          // } else {
          //   socket.emit("change", [
          //     ...userUpdate,
          //     {
          //       id: socket.id,
          //       videoFlag: true,
          //       audioFlag,
          //     },
          //   ]);
          //   track.enabled = true;
          // }
          setVideoFlag((prev) => !prev);
        }
      });
    }
  };

  const handleAudio = () => {
    if (!userVideo.current) return;
    if (userVideo.current.srcObject) {
      (userVideo.current.srcObject as MediaStream).getTracks().forEach(function (track: any) {
        if (track.kind === "audio") {
          if (track.enabled) {
            socket.emit("change", [
              ...userUpdate,
              {
                id: socket.id,
                videoFlag,
                audioFlag: false,
              },
            ]);
            track.enabled = false;
          } else {
            socket.emit("change", [
              ...userUpdate,
              {
                id: socket.id,
                videoFlag,
                audioFlag: true,
              },
            ]);
            track.enabled = true;
          }
          setAudioFlag((prev) => !prev);
        }
      });
    }
  };

  useEffect(() => {
    let localStream: MediaStream | null = null;

    function addPeer(incomingSignal: string, callerID: string, stream: any) {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("returning signal", { signal, callerID });
      });

      peer.signal(incomingSignal);

      return peer;
    }

    function createPeer(userToSignal: string, callerID: string, stream: any) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("sending signal", {
          userToSignal,
          callerID,
          signal,
        });
      });

      peer.on("close", () => {
        // Handle peer connection closed
        console.log("Peer connection closed");
      });

      return peer;
    }
    const videoConstraints = {
      minAspectRatio: 1.333,
      minFrameRate: 60,
      height: window.innerHeight / 1.8,
      width: window.innerWidth / 2,
    };

    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then((stream) => {
      if (!userVideo.current) return;
      userVideo.current.srcObject = stream;
      localStream = stream;
      socket.emit("join_video_chat", room);

      socket.on(
        "all users",
        ({ usersInThisRoom: users }: { usersInThisRoom: string[]; count: number }) => {
          //users: list of other socket.id
          const peerList: PeerRefType[] = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socket.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peerList.push({ peerID: userID, peer });
          });
          setPeers(peerList);
        }
      );

      socket.on("user joined", (payload: { signal: any; callerID: string }) => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({ peerID: payload.callerID, peer });
        setPeers([...peersRef.current]);
      });

      socket.on("receiving returned signal", (payload: { signal: any; id: string }) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        if (item) {
          item.peer.signal(payload.signal);
        }
      });

      socket.on("user_left_video", (userId: string) => {
        // const peer = peersRef.current.find((p) => p.peerID === userId);
        // if (peer) {
        //   peer.peer.destroy();
        // }
        const remainingPeers = peersRef.current.filter((p) => p.peerID !== userId);
        peersRef.current = remainingPeers;
        setPeers(remainingPeers);
      });

      socket.on("change", (payload: any) => {
        setUserUpdate(payload);
      });
    });

    return () => {
      socket.off("all users");
      socket.off("user joined");
      socket.off("receiving returned signal");
      socket.off("user_left_video");
      socket.off("change");
      peersRef.current = [];
      setPeers([]);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      //Destroy all peer connections
      peersRef.current.forEach((peer) => {
        peer.peer.destroy();
      });
    };
  }, [room, socket]);

  return (
    <div className="container">
      <video muted ref={userVideo} autoPlay playsInline />
      <div className="Controls">
        <img className="ImgComponent" src={videoFlag ? webcam : webcamoff} onClick={handleVideo} />
        &nbsp;&nbsp;&nbsp;
        <img className="ImgComponent" src={audioFlag ? micunmute : micmute} onClick={handleAudio} />
      </div>

      {/* other user videos */}
      {peers.map((peer: PeerRefType, index: number) => {
        let audioFlagTemp = true;
        let videoFlagTemp = true;
        if (userUpdate) {
          const mediaData = userUpdate.find((entry) => entry.id === peer.peerID);
          if (mediaData) {
            const { audioFlag, videoFlag } = mediaData;
            audioFlagTemp = audioFlag;
            videoFlagTemp = videoFlag;
          }
        }
        return (
          <div key={index}>
            <Video peer={peer.peer} />
            <div className="ControlSmall">
              <img className="ImgComponentSmall" src={videoFlagTemp ? webcam : webcamoff} />
              &nbsp;&nbsp;&nbsp;
              <img className="ImgComponentSmall" src={audioFlagTemp ? micunmute : micmute} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Video({ peer }: { peer: Peer.Instance }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    peer.on("stream", (stream: any) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });

    return () => {
      peer.destroy();
    };
  }, [peer]);

  return <video playsInline autoPlay ref={ref} />;
}
