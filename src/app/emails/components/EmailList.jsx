"use client";

import EmailCard from "./EmailCard";

export default function EmailList({ emails, onSelectEmail }) {
  return (
    <div className="flex flex-col gap-4">
      {emails.map((email) => (
        <div key={email.id} onClick={() => onSelectEmail(email) } className="cursor-pointer">
          <EmailCard email={email} />
        </div>
      ))}
    </div>
  );
}
