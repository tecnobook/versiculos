import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    // O alerta desaparecerá após 3 segundos (3000ms)
    const timer = setTimeout(() => {
      onClose(); // Chama a função de fechamento para remover o alerta
    }, 1000);

    return () => clearTimeout(timer); // Limpa o timer caso o componente seja desmontado antes do tempo
  }, [message, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        zIndex: "1000",
        fontSize: "16px",
      }}
    >
      {message}
    </div>
  );
};

export default Toast;