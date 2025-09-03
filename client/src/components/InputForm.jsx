import { ArrowUp, Loader2, Squircle, Square } from "lucide-react";

function InputForm({ input, setInput, handleSubmit, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  let isButtonDisabled = !input.trim() && !loading

  return (
    <div className="border-t border-white/10 bg-black p-4">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-end space-x-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "40px";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white placeholder-white/40 
              focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent 
              resize-none custom-scrollbar-hide"
            rows={1}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className={`${isButtonDisabled ? "bg-white/50" : "bg-white"} text-black rounded-full p-2 hover:bg-white/90 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {!loading ? (
              <ArrowUp className="w-5 h-5" />
            ) : (
              <Square className="w-4 h-4" fill="currentColor" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputForm;