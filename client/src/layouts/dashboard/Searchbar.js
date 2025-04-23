import { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  IconButton,
  Input,
  InputAdornment,
  CircularProgress,
  Box,
  Typography,
  Slide,
  useMediaQuery,
} from "@mui/material";
import Iconify from "../../components/Iconify";

const ResizableChatWrapper = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: "90px",
  left: "30px",
  width: "400px",
  minHeight: "300px",
  maxHeight: "90vh",
  resize: "vertical",
  overflow: "hidden",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
}));

const ChatBox = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.customShadows.z12,
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const ChatBody = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  paddingBottom: 0,
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ChatInput = styled(Input)(({ theme }) => ({
  width: "100%",
  borderRadius: "20px",
}));

export default function LiveChat() {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const chatBodyRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");

  const user = JSON.parse(localStorage.getItem("profile")) || {};

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setChatMessages((prev) => [...prev, { sender: "user", message: query }]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/financial-query", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
        }),
      });

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", message: data?.message || "No response found." },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", message: "Error fetching response. Try again." },
      ]);
    }

    setLoading(false);
    setQuery("");
  };

  return (
    <div>
      {!isOpen && (
        <IconButton
          onClick={handleOpen}
          sx={{
            position: "fixed",
            top: isMobile ? "10px" : "13px",
            left: isMobile ? "60px" : "70px",
            zIndex: 9999,
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: "50%",
            padding: "12px",
          }}
        >
          <Iconify icon="eva:message-square-fill" width={24} height={24} />
        </IconButton>
      )}

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <ResizableChatWrapper>
          <ChatBox>
            <ChatHeader>
              <Typography variant="h6">Live Chat</Typography>
              <IconButton
                onClick={handleClose}
                sx={{ color: "text.secondary" }}
              >
                <Iconify icon="eva:close-fill" width={20} height={20} />
              </IconButton>
            </ChatHeader>

            <ChatBody ref={chatBodyRef}>
              {chatMessages.map((msg, index) => (
                <Box key={index} sx={{ marginBottom: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: msg.sender === "user" ? "bold" : "normal",
                      color: msg.sender === "user" ? "blue" : "black",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {msg.sender === "user" ? "You:" : "Bot:"} {msg.message}
                  </Typography>
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </ChatBody>

            <ChatInputContainer>
              <ChatInput
                autoFocus
                placeholder="Type your message..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading && query.trim()) {
                    handleSearch();
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled", width: 20, height: 20 }}
                    />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={loading || !query.trim()}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </InputAdornment>
                }
              />
            </ChatInputContainer>
          </ChatBox>
        </ResizableChatWrapper>
      </Slide>
    </div>
  );
}

// import { useState, useRef, useEffect } from "react";
// import { styled } from "@mui/material/styles";
// import {
//   Button,
//   IconButton,
//   Input,
//   InputAdornment,
//   CircularProgress,
//   Box,
//   Typography,
//   Slide,
//   useMediaQuery,
// } from "@mui/material";
// import Iconify from "../../components/Iconify";

// const ChatBox = styled(Box)(({ theme }) => ({
//   position: "fixed",
//   top: "90px",
//   left: "30px",
//   width: "400px",
//   height: "400px",
//   backgroundColor: theme.palette.background.paper,
//   boxShadow: theme.customShadows.z12,
//   borderRadius: "10px",
//   padding: theme.spacing(2),
//   overflow: "hidden",
//   zIndex: 9999,
//   display: "flex",
//   flexDirection: "column",
// }));

// const ChatHeader = styled(Box)(({ theme }) => ({
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   paddingBottom: theme.spacing(1),
// }));

// const ChatBody = styled(Box)(({ theme }) => ({
//   flexGrow: 1,
//   overflowY: "auto",
//   marginBottom: theme.spacing(1),
//   maxHeight: "320px",
//   paddingRight: theme.spacing(1),
// }));

// const ChatInput = styled(Input)(({ theme }) => ({
//   width: "100%",
//   borderRadius: "20px",
//   marginTop: theme.spacing(2),
// }));

// export default function LiveChat() {
//   const [isOpen, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [chatMessages, setChatMessages] = useState([]);
//   const chatBodyRef = useRef(null);
//   const isMobile = useMediaQuery("(max-width:600px)");

//   const user = JSON.parse(localStorage.getItem("profile")) || {};

//   useEffect(() => {
//     if (chatBodyRef.current) {
//       chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
//     }
//   }, [chatMessages]);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     setQuery("");
//   };

//   const handleSearch = async () => {
//     if (!query.trim()) return;
//     setLoading(true);

//     setChatMessages((prev) => [...prev, { sender: "user", message: query }]);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch("/api/financial-query", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query,
//           userId: user.id,
//           userName: user.name,
//           userEmail: user.email,
//         }),
//       });

//       const data = await res.json();
//       setChatMessages((prev) => [
//         ...prev,
//         { sender: "bot", message: data?.message || "No response found." },
//       ]);
//     } catch (error) {
//       console.error("Error:", error);
//       setChatMessages((prev) => [
//         ...prev,
//         { sender: "bot", message: "Error fetching response. Try again." },
//       ]);
//     }

//     setLoading(false);
//     setQuery("");
//   };

//   return (
//     <div>
//       {/* Open Chat Button */}
//       {!isOpen && (
//         <IconButton
//           onClick={handleOpen}
//           sx={{
//             position: "fixed",
//             top: isMobile ? "10px" : "13px",
//             left: isMobile ? "60px" : "70px",
//             zIndex: 9999,
//             backgroundColor: "primary.main",
//             color: "white",
//             borderRadius: "50%",
//             padding: "12px",
//           }}
//         >
//           <Iconify icon="eva:message-square-fill" width={24} height={24} />
//         </IconButton>
//       )}

//       {/* Chat Box */}
//       <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
//         <ChatBox>
//           {/* Header */}
//           <ChatHeader>
//             <Typography variant="h6">Live Chat</Typography>
//             <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
//               <Iconify icon="eva:close-fill" width={20} height={20} />
//             </IconButton>
//           </ChatHeader>

//           {/* Body (Chat Messages) */}
//           <ChatBody ref={chatBodyRef}>
//             {chatMessages.map((msg, index) => (
//               <Box key={index} sx={{ marginBottom: 1 }}>
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     fontWeight: msg.sender === "user" ? "bold" : "normal",
//                     color: msg.sender === "user" ? "blue" : "black",
//                     whiteSpace: "pre-line",
//                   }}
//                 >
//                   {msg.sender === "user" ? "You:" : "Bot:"} {msg.message}
//                 </Typography>
//               </Box>
//             ))}
//             {loading && (
//               <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                 <CircularProgress size={20} />
//               </Box>
//             )}
//           </ChatBody>

//           {/* Input Field */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <ChatInput
//               autoFocus
//               placeholder="Type your message..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !loading && query.trim()) {
//                   handleSearch();
//                 }
//               }}
//               startAdornment={
//                 <InputAdornment position="start">
//                   <Iconify
//                     icon="eva:search-fill"
//                     sx={{ color: "text.disabled", width: 20, height: 20 }}
//                   />
//                 </InputAdornment>
//               }
//               endAdornment={
//                 <InputAdornment position="end">
//                   <Button
//                     variant="contained"
//                     onClick={handleSearch}
//                     disabled={loading || !query.trim()}
//                   >
//                     {loading ? (
//                       <CircularProgress size={20} color="inherit" />
//                     ) : (
//                       "Send"
//                     )}
//                   </Button>
//                 </InputAdornment>
//               }
//             />
//           </Box>
//         </ChatBox>
//       </Slide>
//     </div>
//   );
// }
