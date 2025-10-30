import React from 'react';
import { ChatMessage } from '../types';

export const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    return (
        <div className="flex items-end justify-end">
            <div className="max-w-md md:max-w-lg px-4 py-3 rounded-2xl bg-teal-600 text-white rounded-br-none">
                <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
            </div>
        </div>
    );
};
