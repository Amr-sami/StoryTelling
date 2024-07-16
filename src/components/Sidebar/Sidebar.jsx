import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat, setResultData } =
    useContext(Context);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt.prompt);
    setResultData(prompt.result);
    onSent(prompt.prompt); // To set loading and show result
  };

  const handleShowHelpPopup = () => {
    setShowHelpPopup(true);
  };

  const handleCloseHelpPopup = () => {
    setShowHelpPopup(false);
  };

  const handleShowSettingsPopup = () => {
    setShowSettingsPopup(true);
  };

  const handleCloseSettingsPopup = () => {
    setShowSettingsPopup(false);
  };

  const handleMoreInfo = () => {
    window.open("info.html", "_blank");
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.menu_icon}
          alt="Menu Icon"
        />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="Plus Icon" />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => (
              <div
                onClick={() => loadPrompt(item)}
                className="recent-entry"
                key={index}
              >
                <img src={assets.message_icon} alt="Message Icon" />
                <p>{item.prompt.slice(0, 18)} ...</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img onClick={handleShowHelpPopup} src={assets.setting_icon} alt="" />
          {extended ? <p>Settings</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img
            onClick={handleShowSettingsPopup}
            src={assets.question_icon}
            alt=""
          />
          {extended ? <p>Help</p> : null}
        </div>
      </div>
      {showHelpPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleCloseHelpPopup}>
              &times;
            </span>
            <h>Contact us on </h>
            <p>
              <a href="mailto:NarrativeHub@outlook.com">
                NarrativeHub@outlook.com
              </a>
            </p>
            <p>
              <a href="mailto:yournarrativehub@gmail.com">
                yournarrativehub@gmail.com
              </a>
            </p>
            <p>About us</p>
            <img
              src="https://www.heirloommedia.co/wp-content/uploads/2018/03/about.png"
              alt=""
              onClick={handleMoreInfo}
            />
          </div>
        </div>
      )}
      {showSettingsPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleCloseSettingsPopup}>
              &times;
            </span>
            <p>
              <img src={assets.send_icon} alt="" />
              Send icon ,
            </p>
            <p>
              <img src={assets.Regenerate} alt="" />
              Regenerate a new story from recent prompt
            </p>
            <p>
              <img src={assets.save} alt="" />
              Save result story on your desktop
            </p>
            <p>
              <img
                src="https://www.svgrepo.com/show/387102/change.svg"
                alt=""
              />
              Change the background of the website
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
