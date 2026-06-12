import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconSparkle } from "@tabler/icons-react";

import { useState } from "react";

import Chat from "@/components/ui/course/chat";
import { backendURL } from "@/api/api";

export default function SheetSide({ lecture }) {
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);

  async function onNewMessage(message) {
    const question = message.trim();
    if (!question || isAsking) return;

    if (!lecture?._id) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: question, sender: "user" },
        { text: "Please select a lecture before asking AI.", sender: "ai" },
      ]);
      return;
    }

    setIsAsking(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: question, sender: "user" },
      { text: "Thinking...", sender: "ai", loading: true },
    ]);

    try {
      const response = await fetch(`${backendURL}/api/lectures/${lecture._id}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Unable to ask AI");
      }

      setMessages((prevMessages) => [
        ...prevMessages.filter((item) => !item.loading),
        { text: data.answer || "I could not generate an answer.", sender: "ai" },
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages.filter((item) => !item.loading),
        { text: error.message || "Unable to ask AI. Please try again.", sender: "ai" },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" className="capitalize">
              Open Chat
              <IconSparkle />
            </Button>
          }
        />
        <SheetContent side="right" className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]">
          <SheetHeader>
            <SheetTitle>Ask AI</SheetTitle>
            <SheetDescription>Ask questions about the current lecture.</SheetDescription>
          </SheetHeader>
          <section className="no-scrollbar overflow-y-auto px-4">
            <ul className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <li key={index} className={`p-2 ${msg.sender === "user" ? "justify-end" : "justify-start"} flex`}>
                  <span
                    className={`font-semibold flex items-center justify-center rounded-lg py-2 px-4 flex-wrap whitespace-pre-wrap ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} ${msg.loading ? "animate-pulse" : ""}`}
                  >
                    {msg.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <SheetFooter>
            <Chat onMessageSend={onNewMessage} disabled={isAsking || !lecture} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
