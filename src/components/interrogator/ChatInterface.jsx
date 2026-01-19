import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User as UserIcon, Sparkles, FileText, Copy, Check } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SmartPromptChips from './SmartPromptChips';
import { askAboutDocument, isApiConfigured } from '../../lib/pdfAnalysisService';

export default function ChatInterface({ documentFile, initialAnalysis, financialData }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    // Add initial analysis as first message when received
    useEffect(() => {
        if (initialAnalysis) {
            setMessages([{
                role: 'assistant',
                message: initialAnalysis,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isAnalysis: true
            }]);
        }
    }, [initialAnalysis]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            role: 'user',
            message: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // If we have a document file and API is configured, use Gemini
        if (documentFile && isApiConfigured()) {
            const result = await askAboutDocument(documentFile, input);

            setMessages(prev => [...prev, {
                role: 'assistant',
                message: result.success ? result.answer : `Error: ${result.error}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isError: !result.success
            }]);
        } else {
            // Fallback response
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    message: documentFile
                        ? 'Please configure your Gemini API key in the .env file to enable AI-powered document analysis.'
                        : 'Please upload a document first to ask questions about it.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 1000);
        }

        setIsTyping(false);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Handle smart prompt chip click - auto-populate and send
    const handlePromptChipClick = async (promptText) => {
        setInput(promptText);

        // Immediately send the prompt
        const userMessage = {
            role: 'user',
            message: promptText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        if (documentFile && isApiConfigured()) {
            const result = await askAboutDocument(documentFile, promptText);
            setMessages(prev => [...prev, {
                role: 'assistant',
                message: result.success ? result.answer : `Error: ${result.error}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isError: !result.success
            }]);
        } else if (!documentFile && isApiConfigured()) {
            // General market query without document
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    message: 'This feature requires a document to be uploaded. Please upload a financial document to get AI-powered analysis.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 1000);
        } else {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    message: 'Please configure your Gemini API key in the .env file to enable AI-powered analysis.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 1000);
        }

        setIsTyping(false);
        setInput('');
    };

    const suggestedQuestions = [
        'What is the revenue growth?',
        'Analyze profitability',
        'Key risk factors?',
        'Dividend history'
    ];

    return (
        <Card className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indus-500 to-indus-600 rounded-md flex items-center justify-center">
                            <Bot className="text-white" size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">AI Financial Analyst</h3>
                            <p className="text-xs text-slate-400">
                                {isApiConfigured() ? 'Powered by Gemini 1.5 Flash' : 'Configure API key for AI'}
                            </p>
                        </div>
                    </div>
                    {documentFile && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-md">
                            <FileText size={12} />
                            <span className="truncate max-w-[120px]">{documentFile.name}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Smart Prompt Chips */}
            <SmartPromptChips
                hasDocument={!!documentFile}
                onPromptSelect={handlePromptChipClick}
            />

            {/* Financial Data Summary */}
            {financialData && (
                <div className="mb-4 p-3 bg-slate-800/50 rounded-md border border-slate-700">
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <Sparkles size={14} className="text-indus-500" />
                        Extracted Key Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-slate-400">Company:</span>
                            <span className="text-white ml-1">{financialData.companyName || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="text-slate-400">Period:</span>
                            <span className="text-white ml-1">{financialData.reportPeriod || 'N/A'}</span>
                        </div>
                        {financialData.revenue && (
                            <div>
                                <span className="text-slate-400">Revenue:</span>
                                <span className="text-white ml-1">
                                    ${financialData.revenue.value} {financialData.revenue.unit}
                                </span>
                            </div>
                        )}
                        {financialData.netProfit && (
                            <div>
                                <span className="text-slate-400">Net Profit:</span>
                                <span className="text-white ml-1">
                                    ${financialData.netProfit.value} {financialData.netProfit.unit}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-center">
                        <div className="text-slate-500">
                            <Bot size={48} className="mx-auto mb-3 opacity-50" />
                            <p className="mb-2">Upload a document to get started</p>
                            <p className="text-xs">I'll analyze it and answer your questions</p>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 bg-indus-500/10 rounded-md flex items-center justify-center flex-shrink-0">
                                    <Bot className="text-indus-500" size={16} />
                                </div>
                            )}

                            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                                <div className={`
                  rounded-md p-4 relative group
                  ${msg.role === 'user'
                                        ? 'bg-indus-500 text-white'
                                        : msg.isError
                                            ? 'bg-loss/10 text-loss border border-loss/20'
                                            : 'bg-slate-800 text-slate-100'
                                    }
                `}>
                                    {msg.role === 'assistant' && msg.isAnalysis && (
                                        <div className="flex items-center gap-2 text-indus-400 text-xs mb-3 pb-2 border-b border-slate-700">
                                            <Sparkles size={12} />
                                            <span>AI Analysis Report</span>
                                        </div>
                                    )}

                                    <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'assistant' ? 'font-mono text-xs' : ''}`}>
                                        {msg.message}
                                    </div>

                                    {/* Copy Button */}
                                    {msg.role === 'assistant' && !msg.isError && (
                                        <button
                                            onClick={() => handleCopy(msg.message, index)}
                                            className="absolute top-2 right-2 p-1.5 bg-slate-700/50 hover:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {copiedIndex === index ? (
                                                <Check size={12} className="text-profit" />
                                            ) : (
                                                <Copy size={12} className="text-slate-400" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1 px-1">{msg.timestamp}</p>
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="text-slate-300" size={16} />
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 bg-indus-500/10 rounded-md flex items-center justify-center flex-shrink-0">
                                <Bot className="text-indus-500" size={16} />
                            </div>
                            <div className="bg-slate-800 rounded-md p-4">
                                <div className="flex items-center gap-1">
                                    {[0, 0.2, 0.4].map((delay, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay }}
                                            className="w-2 h-2 bg-indus-500 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-800 pt-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={documentFile ? "Ask about the document..." : "Upload a document first..."}
                        disabled={!documentFile}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indus-500/50 focus:border-indus-500 disabled:opacity-50"
                    />
                    <Button
                        variant="primary"
                        icon={Send}
                        onClick={handleSendMessage}
                        disabled={!documentFile || !input.trim()}
                    >
                        Send
                    </Button>
                </div>

                {/* Quick Suggestions */}
                {documentFile && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(q)}
                                className="text-xs px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-300 rounded-md border border-slate-700 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
