// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InputField(props: any) {
  return (
    <div className="form-group">
      <label>{props.title}</label>
      <input
        type={props.type}
        onChange={props.handleInputChange}
        name={props.name}
        value={props.value}
        {...props}
      />
      {props.errMessage !== "" && <span className="label-danger">{props.errMessage}</span>}
    </div>
  );
}
