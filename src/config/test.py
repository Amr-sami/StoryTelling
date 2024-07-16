from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
from fastapi.middleware.cors import CORSMiddleware
import torch

# Define the request body format
class TextGenerationRequest(BaseModel):
    prompt: str
    max_length: int = 150
    top_k: int = 50
    top_p: float = 0.95
    repetition_penalty: float = 2.0

# Initialize the FastAPI app
test = FastAPI()

# Load the model and tokenizer
model_name_or_path = "./trained model"
tokenizer = AutoTokenizer.from_pretrained(model_name_or_path)
model = AutoModelForCausalLM.from_pretrained(model_name_or_path, torch_dtype=torch.float16)

# CORS middleware configuration to allow all origins
test.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@test.post("/generate/")
async def generate_text(request: TextGenerationRequest):
    try:
        inputs = tokenizer.encode_plus(request.prompt, return_tensors="pt", max_length=request.max_length, truncation=True, padding=True)
        outputs = model.generate(
            inputs.input_ids,
            max_length=request.max_length,
            num_return_sequences=1,
            attention_mask=inputs.attention_mask,
            top_k=request.top_k,
            top_p=request.top_p,
            repetition_penalty=request.repetition_penalty,
            do_sample=True
        )
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return {"generated_text": generated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(test, host="0.0.0.0", port=8000)
