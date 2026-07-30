"use client";
import { useState, useEffect } from "react";
import "./UnreadInquiries.scss";

const UnreadInquiries = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch(
          `/api/chegall-inquiries?where[read][equals]=false&limit=0`,
        );
        const data = await res.json();
        setUnreadCount(data.totalDocs);
      } catch (err) {
        console.error("Failed to fetch unread inquiries:", err);
      }
    };

    fetchUnread();
  }, []);

  if (unreadCount === 0) return null;

  return (
    <div className="unread-inquiries-widget">
      <div className="card">
        <h3>New Inquiries</h3>
        <p>You have {unreadCount} unread message(s)!</p>
        <a href={`/payload/collections/chegall-inquiries`}>
          View Inquiries
          <span className="badge">{unreadCount}</span>
        </a>
      </div>
    </div>
  );
};

export default UnreadInquiries;
