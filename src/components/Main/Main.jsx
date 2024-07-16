import React, { useContext, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    reload,
  } = useContext(Context);

  const [themes] = useState(["default", "sunrise", "forest"]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  const changeTheme = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length;
    setCurrentThemeIndex(nextIndex);
  };

  const handleSaveStory = () => {
    const doc = new jsPDF();
    const text = resultData;

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxLineWidth = pageWidth - margin * 2;

    const lines = doc.splitTextToSize(text, maxLineWidth);

    doc.text(lines, margin, margin);
    doc.save("story.pdf");
  };

  return (
    <div className={`main ${themes[currentThemeIndex]}`}>
      <div className="nav">
        <p>Narrative Hub</p>
        <img
          src="https://www.svgrepo.com/show/387102/change.svg"
          alt="User Icon"
          onClick={changeTheme}
          style={{
            cursor: "pointer",
            filter:
              "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
          }}
        />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Poet</span>
              </p>
              <p>Let's create innovative stories</p>
            </div>
            <div className="cards">
              <div className="card card1">
                <p>Superhero Stories</p>
              </div>
              <div className="card card2">
                <p>Romance Stories</p>
              </div>
              <div className="card card3">
                <p>Action Stories</p>
              </div>
              <div className="card card4">
                <p>Adventure Stories</p>
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img
                src="https://www.svgrepo.com/show/51941/male-user.svg"
                alt=""
                style={{
                  filter:
                    "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
                }}
              />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.narrative} alt="Gemini Icon" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img onClick={handleSaveStory} src={assets.save} alt="" />
              <img
                onClick={() => reload(recentPrompt)}
                src={assets.Regenerate}
                alt=""
              />
              {input ? (
                <img
                  onClick={() => onSent(input)}
                  src={assets.send_icon}
                  alt="Send"
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            It may display an inaccurate story, so double-check its response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
