/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutableRefObject, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

interface VideoCallProps {
  socket: any;
  room: string;
}

type peerRefsType = {
  peerID: string;
  peer: any;
};
const initialPeersRefs: peerRefsType[] = [];
const abc:any =[]

export default function VideoCall({ socket, room }: VideoCallProps) {
  const userVideo = useRef() as MutableRefObject<HTMLVideoElement | null>;

  const [peers, setPeers] = useState(abc);
  const [, setUserUpdate] = useState([]);
  const peersRef = useRef(initialPeersRefs);

  useEffect(() => {
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
  
      return peer;
    }
    const videoConstraints = {
      minAspectRatio: 1.333,
      minFrameRate: 60,
      height: window.innerHeight / 1.8,
      width: window.innerWidth / 2,
    }
      navigator.mediaDevices
        .getUserMedia({ video: videoConstraints, audio: true })
        .then((stream) => {
          if (!userVideo.current) return;
          userVideo.current.srcObject = stream;
          socket.emit("join_video_chat", room);
          socket.on("all users", ({usersInThisRoom: users, count}:{ usersInThisRoom:string[], count:number}) => {
            if(count ===1) return
            //users: list of other socket.id
            const peers: any = [];
            users.forEach((userID) => {
              const peer = createPeer(userID, socket.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push({
                peerID: userID,
                peer,
              });
            });
            setPeers(peers);
          });

          socket.on("user joined", (payload: { signal: any; callerID: string }) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });  
            setPeers((users:any) => [...users,{peerId:payload.callerID, peer}]);
          });

          socket.on("receiving returned signal", (payload: { signal: any; id: string }) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            if (!item) return;
            item.peer.signal(payload.signal);
          });

          socket.on("user_left_video", (userId: string) => {
            const peerObj = peersRef.current.find((p) => p.peerID === userId);
            if (peerObj) {
              peerObj.peer.destroy();
            }
            const peers = peersRef.current.filter((p) => p.peerID !== userId);
            peersRef.current = peers;
            setPeers(peers);
          });

         

          socket.on("change", (payload: any) => {
            setUserUpdate(payload);
          });
        });

  }, [room, socket]);


  return (
    <div className="container">
      <video muted ref={userVideo} autoPlay playsInline/>

      {/* other user videos */}
      {peers.map((peer:any, index: number) => {
        return (
          <div key={index}>
            <Video peer={peer.peer} />
          </div>
        );
      })}
    </div>
  );
}

function Video({ peer }: { peer: any }) {
  const ref = useRef() as MutableRefObject<HTMLVideoElement | null>;

  useEffect(() => {
    peer.on("stream", (stream: any) => {
      if (!ref.current) return;
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <video playsInline autoPlay ref={ref} />;
}
