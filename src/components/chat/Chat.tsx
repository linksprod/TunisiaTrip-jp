
import React from "react";
import { ChatButton } from "./ChatButton";
import { ChatDialog } from "./ChatDialog";

export function Chat() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Listen for custom event to open chat
  React.useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  return (
    <>
      <ChatButton onClick={handleToggleChat} isOpen={isOpen} />
      <ChatDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
