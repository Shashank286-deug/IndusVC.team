import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronLeft, ChevronRight, Upload, Link, X, ZoomIn, ZoomOut, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import { analyzePDF, extractFinancialData, isApiConfigured } from '../../lib/pdfAnalysisService';

export default function PDFViewer({ onDocumentLoad, onAnalysisComplete, currentFile }) {
    const [document, setDocument] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(!currentFile);
    const [urlInput, setUrlInput] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStatus, setAnalysisStatus] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            handleFileUpload(files[0]);
        }
    }, []);

    const handleFileUpload = async (file) => {
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        setDocument({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            file: file
        });

        setShowUploadModal(false);
        onDocumentLoad && onDocumentLoad(file);

        // Auto-analyze if API is configured
        if (isApiConfigured()) {
            await analyzeDocument(file);
        }
    };

    const analyzeDocument = async (file) => {
        setIsAnalyzing(true);
        setAnalysisStatus({ type: 'loading', message: 'Analyzing document with Gemini AI...' });

        try {
            // Run both analysis and data extraction in parallel
            const [analysisResult, dataResult] = await Promise.all([
                analyzePDF(file),
                extractFinancialData(file)
            ]);

            if (analysisResult.success) {
                setAnalysisStatus({ type: 'success', message: 'Analysis complete!' });
                onAnalysisComplete && onAnalysisComplete({
                    analysis: analysisResult.analysis,
                    financialData: dataResult.success ? dataResult.data : null,
                    file: file
                });
            } else {
                setAnalysisStatus({ type: 'error', message: analysisResult.error });
            }
        } catch (error) {
            setAnalysisStatus({ type: 'error', message: 'Failed to analyze document' });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleUrlSubmit = async () => {
        if (urlInput.trim()) {
            setAnalysisStatus({ type: 'loading', message: 'Fetching document from URL...' });
            try {
                const response = await fetch(urlInput);
                const blob = await response.blob();
                const file = new File([blob], urlInput.split('/').pop() || 'document.pdf', { type: 'application/pdf' });
                await handleFileUpload(file);
            } catch (error) {
                setAnalysisStatus({ type: 'error', message: 'Failed to fetch document from URL' });
            }
        }
    };

    // Upload Modal Component
    const UploadModal = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/95 z-10 flex items-center justify-center p-4 rounded-md"
        >
            <div className="max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Upload Financial Document</h3>
                    {document && (
                        <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* API Status */}
                {!isApiConfigured() && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex items-start gap-2">
                        <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-400">
                            Add your Gemini API key to <code className="bg-slate-800 px-1 rounded">.env</code> for AI analysis
                        </p>
                    </div>
                )}

                {/* Drag & Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-all cursor-pointer
            ${isDragging
                            ? 'border-indus-500 bg-indus-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }
          `}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className={`mx-auto mb-3 ${isDragging ? 'text-indus-500' : 'text-slate-400'}`} size={40} />
                    <p className="text-slate-300 mb-2">Drag & drop your PDF here</p>
                    <p className="text-sm text-slate-500 mb-4">Annual Reports, 10-K, Quarterly Statements</p>
                    <button
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="px-4 py-2 bg-indus-500 hover:bg-indus-600 text-white rounded-md transition-colors"
                    >
                        Browse Files
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="hidden"
                    />
                </div>

                {/* URL Input */}
                <div className="border-t border-slate-700 pt-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Link size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-400">Or paste a document URL</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://example.com/annual-report.pdf"
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indus-500/50"
                        />
                        <button
                            onClick={handleUrlSubmit}
                            disabled={!urlInput.trim()}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                        >
                            Load
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <Card className="h-full flex flex-col relative">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indus-500/10 rounded-md flex items-center justify-center">
                            <FileText className="text-indus-500" size={20} />
                        </div>
                        <div>
                            {document ? (
                                <>
                                    <h3 className="text-white font-semibold truncate max-w-[200px]">{document.name}</h3>
                                    <p className="text-xs text-slate-400">{document.size}</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-white font-semibold">No Document Loaded</h3>
                                    <p className="text-xs text-slate-400">Upload a PDF to analyze</p>
                                </>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indus-500/10 hover:bg-indus-500/20 text-indus-400 rounded-md text-sm transition-colors"
                    >
                        <Upload size={14} />
                        {document ? 'Change' : 'Upload'}
                    </button>
                </div>

                {/* Analysis Status */}
                <AnimatePresence>
                    {analysisStatus && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                        >
                            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md ${analysisStatus.type === 'loading' ? 'bg-blue-500/10 text-blue-400' :
                                    analysisStatus.type === 'success' ? 'bg-profit/10 text-profit' :
                                        'bg-loss/10 text-loss'
                                }`}>
                                {analysisStatus.type === 'loading' ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : analysisStatus.type === 'success' ? (
                                    <CheckCircle size={14} />
                                ) : (
                                    <AlertCircle size={14} />
                                )}
                                <span>{analysisStatus.message}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* PDF Preview */}
            <div className="flex-1 bg-slate-800/30 rounded-md border border-slate-700 overflow-hidden relative">
                {previewUrl ? (
                    <iframe
                        src={previewUrl}
                        className="w-full h-full"
                        title="PDF Preview"
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <FileText size={48} className="mx-auto mb-3 opacity-50" />
                            <p>Upload a document to preview</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Re-analyze Button */}
            {document && !isAnalyzing && isApiConfigured() && (
                <div className="mt-4">
                    <button
                        onClick={() => analyzeDocument(document.file)}
                        className="w-full py-2 bg-indus-500 hover:bg-indus-600 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Loader2 size={14} />
                        Re-analyze with Gemini AI
                    </button>
                </div>
            )}

            {/* Upload Modal Overlay */}
            <AnimatePresence>
                {showUploadModal && <UploadModal />}
            </AnimatePresence>
        </Card>
    );
}
