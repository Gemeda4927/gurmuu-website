import { X, Download, FileText, FileSpreadsheet, File } from "lucide-react";
import { User } from "@/lib/api/superadmin";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
}

export default function ExportModal({
  isOpen,
  onClose,
  users,
}: ExportModalProps) {
  if (!isOpen) return null;

  const handleExport = (format: "csv" | "json" | "pdf") => {
    // Implement export logic based on format
    console.log(`Exporting ${users.length} users as ${format}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Export Users
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Export {users.length} users in your preferred format.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleExport("csv")}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">CSV Format</div>
                  <div className="text-sm text-gray-500">Comma-separated values, ideal for spreadsheets</div>
                </div>
                <Download className="ml-auto w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => handleExport("json")}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">JSON Format</div>
                  <div className="text-sm text-gray-500">JavaScript Object Notation, ideal for developers</div>
                </div>
                <Download className="ml-auto w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={() => handleExport("pdf")}
                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-red-100 rounded-lg mr-4">
                  <File className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">PDF Format</div>
                  <div className="text-sm text-gray-500">Portable Document Format, ideal for printing</div>
                </div>
                <Download className="ml-auto w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}