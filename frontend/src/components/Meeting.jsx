import { useState, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useFirebase } from "../context/firebase";
import { useSearchParams, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Meeting = () => {
    const { currentUser } = useFirebase();
    const meetingRef = useRef(null);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const lawyerId = searchParams.get("lawyerId") || "default_lawyer";
    const role = searchParams.get("role") || "Host";

    const [error, setError] = useState(null);

    useEffect(() => {
        const initMeeting = async () => {
            try {
                // Removed lawyerId check since we now have a default value

                const appID = import.meta.env.VITE_ZEGO_APP_ID;
                const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

                if (!appID || !serverSecret) {
                    console.error("Missing Zego credentials:", {
                        appID,
                        serverSecret,
                    });
                    setError(
                        "Video meeting configuration is missing. Please contact support."
                    );
                    return;
                }

                console.log("Initializing Zego with:", {
                    appID: appID,
                    serverSecret: serverSecret.substring(0, 4) + "...",
                    currentUser: currentUser?.uid,
                });

                const roomID = `meeting_${currentUser.uid}_${lawyerId}`;
                console.log("Creating meeting room:", roomID);

                const userRole =
                    role === "Host"
                        ? ZegoUIKitPrebuilt.Host
                        : role === "Cohost"
                        ? ZegoUIKitPrebuilt.Cohost
                        : ZegoUIKitPrebuilt.Audience;

                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    parseInt(appID),
                    serverSecret,
                    roomID,
                    currentUser.uid || Date.now().toString(),
                    currentUser.displayName || "User"
                );

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                if (!zp) {
                    throw new Error("Failed to create Zego instance");
                }
                console.log("Zego instance created successfully");

                const sharedLinks = [];
                if (
                    userRole === ZegoUIKitPrebuilt.Host ||
                    userRole === ZegoUIKitPrebuilt.Cohost
                ) {
                    sharedLinks.push({
                        name: "Join as co-host",
                        url: `${window.location.origin}${location.pathname}?lawyerId=${lawyerId}&role=Cohost`,
                    });
                }
                sharedLinks.push({
                    name: "Join as audience",
                    url: `${window.location.origin}${location.pathname}?lawyerId=${lawyerId}&role=Audience`,
                });

                await zp.joinRoom({
                    container: meetingRef.current,
                    sharedLinks,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.LiveStreaming,
                        config: {
                            role: userRole,
                        },
                    },
                    showScreenSharingButton: true,
                });
                console.log("Joined room successfully");
                setError(null);
            } catch (error) {
                console.error("Error initializing meeting:", error);
                setError("Failed to initialize meeting. Please try again.");
            }
        };

        if (currentUser && lawyerId) {
            initMeeting();
        }
    }, [currentUser, lawyerId]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Video Meeting
                </h1>
                {!currentUser ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600 mb-4">
                            Please sign in to join the meeting.
                        </p>
                        <a
                            href="/auth"
                            className="inline-block px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                        >
                            Sign In
                        </a>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <a
                            href="/"
                            className="inline-block px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                        >
                            Return Home
                        </a>
                    </div>
                ) : (
                    <div
                        ref={meetingRef}
                        className="w-full aspect-video bg-white rounded-lg shadow-md overflow-hidden"
                    />
                )}
            </div>
        </div>
    );
};

export default Meeting;
