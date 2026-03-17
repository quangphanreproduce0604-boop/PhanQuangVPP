import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Tìm bút bi giá rẻ",
  "Gợi ý quà tặng cho học sinh",
  "So sánh bút Thiên Long và Deli",
  "Sản phẩm bán chạy nhất",
];

const BOT_RESPONSES: Record<string, string> = {
  default: "Xin chào! Tôi là trợ lý AI của VPShop. Tôi có thể giúp bạn tìm kiếm sản phẩm văn phòng phẩm phù hợp. Hãy cho tôi biết bạn cần gì nhé!",
  "bút bi": "Chúng tôi có nhiều loại bút bi chất lượng:\n\n• **Bút bi Thiên Long TL-027** - 5.000₫ (⭐ 4.8)\n• **Bút gel Thiên Long GEL-B01** - 12.000₫ (đang giảm giá!)\n• **Bút lông bảng Thiên Long WB-03** - 15.000₫\n\nBạn muốn xem chi tiết sản phẩm nào?",
  "quà tặng": "Gợi ý quà tặng cho học sinh tiểu học:\n\n🎁 **Bộ bút highlight Deli 6 màu** - 35.000₫\n📒 **Sổ tay bìa cứng Deli A5** - 45.000₫ (giảm 18%!)\n✏️ **Bút chì gỗ Staedtler HB** - 72.000₫/hộp 12 cây\n\nNhững sản phẩm này đều được đánh giá cao và rất phù hợp làm quà!",
  "bán chạy": "Top sản phẩm bán chạy nhất:\n\n1. 🏆 Giấy A4 Double A 80gsm - 89.000₫ (567 đánh giá)\n2. 🏆 Bút chì Staedtler HB - 72.000₫ (312 đánh giá)\n3. 🏆 Bút bi Thiên Long TL-027 - 5.000₫ (234 đánh giá)\n\nTất cả đều có sẵn trong kho!",
  "so sánh": "So sánh Thiên Long vs Deli:\n\n| | Thiên Long | Deli |\n|---|---|---|\n| Giá | Rẻ hơn | Trung bình |\n| Bút bi | ⭐ TL-027 rất phổ biến | Ít lựa chọn |\n| Sổ/bìa | Ít | ⭐ Đa dạng, đẹp |\n| Dụng cụ | Cơ bản | ⭐ Đầy đủ |\n\nTùy nhu cầu mà lựa chọn nhé!",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("bút") || lower.includes("viết")) return BOT_RESPONSES["bút bi"];
  if (lower.includes("quà") || lower.includes("học sinh")) return BOT_RESPONSES["quà tặng"];
  if (lower.includes("bán chạy") || lower.includes("phổ biến")) return BOT_RESPONSES["bán chạy"];
  if (lower.includes("so sánh")) return BOT_RESPONSES["so sánh"];
  return BOT_RESPONSES.default;
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: BOT_RESPONSES.default },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: getBotResponse(text) }]);
      setTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] rounded-2xl border border-border bg-card shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-primary text-primary-foreground">
              <h3 className="font-semibold text-sm">Trợ lý AI VPShop</h3>
              <p className="text-xs opacity-80">Hỏi tôi bất cứ điều gì về văn phòng phẩm!</p>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[320px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-md px-4 py-2">
                    <motion.div className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => send(input)}
                className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
