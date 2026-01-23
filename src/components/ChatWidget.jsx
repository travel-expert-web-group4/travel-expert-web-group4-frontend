import React, { useEffect, useState } from "react";
import { getInteractions } from "../api/chat";
import { useAuth } from "../contexts/AuthContext";
import { FaComments } from "react-icons/fa";
import ChatBox from "./ChatBox";

const ChatWidget = () => {
  const { user, token } = useAuth();
  const [interactions, setInteractions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // 🔄 Load recent chat interactions
  useEffect(() => {
    if (user?.sub) {
      getInteractions(user.sub, token)
        .then((data) => {
          console.log("📨 Loaded interactions:", data);
          // ✅ Map each item to include expected `email`
          const mapped = data.map((item) => ({
            name: item.name,
            profile: item.profilePicture,
            email: item.otherUserId, // ✅ Map this as recipientId
            lastMessage: item.lastMessage,
          }));
          setInteractions(mapped);
        })
        .catch((err) =>
          console.error("❌ Error loading chat interactions:", err)
        );
    }
  }, [user]);

  // 💬 Handle chat open
  const handleOpenChat = (contactData) => {
    const contact = {
      name: contactData.name,
      profile: contactData.profile,
      email: contactData.email, // ✅ Ensures ChatBox gets recipientId
    };
    console.log("💬 Opening chat with:", contact);
    setSelectedContact(contact);
    setOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 💬 Floating Chat Button */}
      <button
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
        onClick={() => setOpen(!open)}
      >
        <FaComments size={24} />
      </button>

      {/* 🧾 Dropdown: Recent or Manual Contact */}
      {open && !selectedContact && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-xl p-4 max-h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Recent Chats</h2>

          {interactions.length === 0 ? (
            <div>
              <p className="text-sm text-gray-500">No recent chats</p>
              <button
                className="text-blue-600 underline mt-2"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `http://localhost:8080/api/customer/${user?.customerId}`,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    const customer = await res.json();
                    const agent = customer.agentid;

                    if (agent && agent.agtemail) {
                      const firstContact = {
                        name: `${agent.agtfirstname} ${agent.agtlastname}`,
                        email: agent.agtemail,
                        profile: agent.profileImageUrl,
                      };

                      console.log("🟢 Starting chat with:", firstContact);
                      setSelectedContact(firstContact);
                      setOpen(true);
                    } else {
                      alert("No agent assigned to your account.");
                    }
                  } catch (err) {
                    console.error(
                      "❌ Error fetching customer agent info:",
                      err
                    );
                  }
                }}
              >
                Start a chat with your agent
              </button>
            </div>
          ) : (
            interactions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleOpenChat(item)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <img
                  src={item.profile || "/avatar-default.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">
                    {item.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 💬 Active Chat Box */}
      {selectedContact && (
        <ChatBox
          contact={selectedContact}
          onClose={() => {
            console.log("❎ Chat closed");
            setSelectedContact(null);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatWidget;
