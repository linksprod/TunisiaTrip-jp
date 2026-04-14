
import React from "react";
import { Link } from "react-router-dom";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export const AdminHeader = ({ title, description, actionButton }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-manrope tracking-tight">{title}</h1>
        {description && (
          <p className="text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {actionButton && (
        <div className="w-full md:w-auto">{actionButton}</div>
      )}
    </div>
  );
};
