import React, { useState, useEffect, useRef } from 'react';
import { DateParser } from '../utils/DateParser';

interface SmartDeadlineInputProps {
    value: string;
    onChange: (dateStr: string) => void;
}

export const SmartDeadlineInput: React.FC<SmartDeadlineInputProps> = ({ value, onChange }) => {
    const [inputText, setInputText] = useState('');
    const [parsedDate, setParsedDate] = useState<Date | null>(null);

    // Sync external value
    useEffect(() => {
        if (value && !inputText) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                setInputText(`${dd}/${mm}/${yyyy}`);
                setParsedDate(date);
            } else {
                setInputText(value); // fallback
            }
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputText(val);
        const date = DateParser.parse(val);
        setParsedDate(date);
        if (date) {
            onChange(date.toISOString().split('T')[0]);
        }
    };

    const handleQuickPick = (val: string) => {
        const date = DateParser.parse(val);
        if (date) {
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            setInputText(`${dd}/${mm}/${yyyy}`);
            setParsedDate(date);
            onChange(date.toISOString().split('T')[0]);
        }
    };

    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDatePick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val) return;
        const date = new Date(val);
        if (!isNaN(date.getTime())) {
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            setInputText(`${dd}/${mm}/${yyyy}`);
            setParsedDate(date);
            onChange(val);
        }
    };

    const isTextInputADate = /^[\d\/\-]+$/.test(inputText.trim());

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="relative">
                <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy"
                    className={`w-full pl-4 pr-12 min-w-[160px] py-3 rounded-xl outline-none`}
                    style={{
                        background: 'var(--glass-bg)',
                        border: `1px solid ${parsedDate ? '#10b981' : 'var(--glass-border)'}`,
                        color: 'var(--text-primary)',
                    }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {parsedDate && !isTextInputADate && (
                        <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded" style={{ background: '#10b98122', color: '#10b981' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            {parsedDate.toLocaleDateString()}
                        </div>
                    )}
                    
                    <button 
                        type="button" 
                        onClick={() => dateInputRef.current?.showPicker?.()} 
                        className="p-1.5 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                        style={{ color: 'var(--text-muted)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border-subtle)' }}
                        title="Choose from calendar"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </button>
                    <input 
                        type="date"
                        ref={dateInputRef}
                        onChange={handleDatePick}
                        className="absolute opacity-0 w-0 h-0 pointer-events-none"
                    />
                </div>
            </div>
            
            <div className="flex gap-2">
                <button type="button" onClick={() => handleQuickPick('Today')} className="text-[10px] px-2 py-1 rounded-full uppercase font-bold" style={{ background: 'var(--glass-bg)', color: 'var(--text-muted)' }}>Today</button>
                <button type="button" onClick={() => handleQuickPick('Tomorrow')} className="text-[10px] px-2 py-1 rounded-full uppercase font-bold" style={{ background: 'var(--glass-bg)', color: 'var(--text-muted)' }}>Tomorrow</button>
                <button type="button" onClick={() => handleQuickPick('Next Week')} className="text-[10px] px-2 py-1 rounded-full uppercase font-bold" style={{ background: 'var(--glass-bg)', color: 'var(--text-muted)' }}>Next Week</button>
            </div>
        </div>
    );
};
