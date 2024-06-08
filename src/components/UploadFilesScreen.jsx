import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Button, Spinner } from '@material-tailwind/react';
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/16/solid';
import useFileUpload from '../hooks/useFileUpload';

// toastify
import { toast } from 'react-toastify';

const UploadFilesScreen = () => {

    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [isUploaded, setIsUploaded] = useState(true);
    const { uploadFile } = useFileUpload();

    const navigate = useNavigate();
    const location = useLocation();

    const handleClearFile = () => {
        setFileName('');
        setFile(null);
    }

    const handleFileUpload = async () => {
        setIsUploaded(false);
        if (! file) return;
        const formData = new FormData();
        try {
            formData.append('file', file);
            const result = await uploadFile(formData);
            toast.success(result.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.error.message);
            if (error?.response?.data?.error.status === 403) {
                navigate('/login', { state: { from: location.pathname }, replace: true });
                return;
            }
        } finally {
            setIsUploaded(true);
        }
    }

    return (
        <Card className="h-[calc(100vh-2rem)] w-full p-8 shadow-xl shadow-blue-gray-900/5">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                onDrop={async (e) => {
                    e.preventDefault();
                    const { files } = e.dataTransfer;
                    if (files){
                        setFileName(files[0].name);
                        setFile(files[0]);
                    }
                }}
            >
                <Card 
                    className="container mx-auto border border-dashed border-gray-900 h-80 w-full p-16 shadow-none flex flex-col justify-center items-center bg-gray-400 hover:bg-gray-300 cursor-pointer"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                >
                    <form>
                        <input 
                            type="file" 
                            hidden
                            onChange={async ({ target: {files} }) => {
                                if (files){
                                    setFileName(files[0].name);
                                    setFile(files[0]);
                                }
                            }}
                        />
                    </form>
                    <ArrowUpTrayIcon className="h-16 w-16 text-gray-900" />
                    <Typography variant='h6' className='text-center'>
                        Click to upload or drag and drop files here
                    </Typography>
                </Card>
            </div>
            {file ? <>
                <div className="file-details p-4 me-auto mt-8 flex shadow-xl shadow-blue-gray-900/5">
                    <Typography variant='h6' className='flex-auto mr-2'>
                        {fileName}
                    </Typography>
                    <TrashIcon className="h-6 w-6 text-red-500 cursor-pointer" onClick={handleClearFile} />
                </div>
                <Button 
                    className={`mt-8 me-auto w-32 text-center`}
                    onClick={handleFileUpload}
                    disabled={!isUploaded}
                >
                    {isUploaded ? "Upload" : <Spinner className='mx-auto h-4 w-4' />}
                </Button>
            </> : null}
        </Card>
    );
}

export default UploadFilesScreen;