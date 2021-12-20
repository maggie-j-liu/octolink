import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const NotCopied = ({ children }: { children: ReactNode }) => {
  const { text, copied, setCopied } = useContext(CopyContext);
  if (copied) {
    return null;
  }
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
      }}
    >
      {children}
    </button>
  );
};

const Copied = ({ children }: { children: ReactNode }) => {
  const { copied } = useContext(CopyContext);
  if (!copied) {
    return null;
  }
  return <>{children}</>;
};

const CopyContext = createContext<{
  copied: boolean;
  setCopied: Dispatch<SetStateAction<boolean>>;
  text: string;
}>({
  copied: false,
  setCopied: () => {},
  text: "",
});

const CopyButton = ({
  text,
  time = 5000,
  children,
}: {
  text: string;
  time?: number;
  children: ReactNode;
}) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, time);
    }
  }, [copied]);
  return (
    <CopyContext.Provider value={{ copied, setCopied, text }}>
      {children}
    </CopyContext.Provider>
  );
};

CopyButton.NotCopied = NotCopied;
CopyButton.Copied = Copied;

export default CopyButton;
