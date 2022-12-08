import React from "react";

const Input = ({ placeholder, value, changeHandler }) => {
  return (
    <input
      value={value}
      onChange={changeHandler}
      className="block w-[70%] my-3 px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
      placeholder={placeholder}
    />
  );
};

const JoinRoomInputs = (props) => {
  const { roomIdValue, setRoomIdValue, nameValue, setNameValue, isRoomHost } =
    props;

  const handleRoomIdValueChange = (event) => {
    setRoomIdValue(event.target.value);
  };

  const handleNameValueChange = (event) => {
    setNameValue(event.target.value);
  };

  return (
    <div className="join_room_inputs_container">
      {!isRoomHost && (
        <Input
          placeholder="Enter meeting ID"
          value={roomIdValue}
          changeHandler={handleRoomIdValueChange}
        />
      )}
      <Input
        placeholder="Enter your Name"
        value={nameValue}
        changeHandler={handleNameValueChange}
      />
    </div>
  );
};

export default JoinRoomInputs;
