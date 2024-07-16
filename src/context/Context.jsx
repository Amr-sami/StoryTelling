import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  useEffect(() => {
    const savedPrompts = JSON.parse(localStorage.getItem("prompts"));
    if (savedPrompts) {
      setPrevPrompts(savedPrompts);
    }
  }, []);

  const saveToLocalStorage = (prompt, result) => {
    const savedPrompts = JSON.parse(localStorage.getItem("prompts")) || [];
    const newPrompt = { prompt, result };
    savedPrompts.unshift(newPrompt);
    localStorage.setItem("prompts", JSON.stringify(savedPrompts));
    setPrevPrompts(savedPrompts);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setResultData("");
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    if (!prompt) {
      prompt = input;
    }
    setRecentPrompt(prompt);
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate", {
        prompt,
        max_length: 150,
      });
      const response = res.data.generated_text;
      saveToLocalStorage(prompt, response);
      setResultData(response);
    } catch (error) {
      console.error("Error generating story:", error);
      setResultData("Sorry, there was an error generating the story.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const reload = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate", {
        prompt,
        max_length: 150,
      });
      const response = res.data.generated_text;
      saveToLocalStorage(prompt, response);
      setResultData(response);
    } catch (error) {
      console.error("Error generating story:", error);
      setResultData("Sorry, there was an error generating the story.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    reload,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
