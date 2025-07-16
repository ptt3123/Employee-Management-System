import React, { useState, useRef } from "react";

export default function Blank() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          setImages((prev) => [...prev, file]);
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("description", description);
    images.forEach((img, index) => {
      formData.append(`image_${index}`, img);
    });

    console.log("Sending form...", formData);
    alert("Đã gửi đơn từ (demo)");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-start px-4 py-10">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Viết đơn từ</h2>

        <div className="mb-4">
          <label className="text-sm text-gray-700 dark:text-gray-300">Đến</label>
          <input
            type="text"
            placeholder="Nhập người nhận"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700 dark:text-gray-300">Tiêu đề</label>
          <input
            type="text"
            placeholder="Nhập tiêu đề"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700 dark:text-gray-300">Nội dung đơn</label>
          <textarea
            placeholder="Nhập nội dung đơn từ..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onPaste={handlePaste}
            rows={10}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Upload ảnh */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-blue-600 hover:underline"
          >
            📎 Đính kèm ảnh
          </button>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`uploaded-${idx}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Gửi đơn
          </button>
        </div>
      </div>
    </div>
  );
}
