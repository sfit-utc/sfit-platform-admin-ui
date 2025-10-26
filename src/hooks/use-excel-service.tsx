import { useState } from "react";
import { readExcelFile, readColumnA } from "@/services/excel-service";

export function useExcelService() {
  const [data, setData] = useState<any[]>([]); 
  const [columnAData, setColumnAData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 

  /**
   * Đọc toàn bộ dữ liệu từ file Excel
   * @param file File Excel được tải lên
   */
  const handleReadExcelFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const jsonData = await readExcelFile(file);
      setData(jsonData);
    } catch (err: any) {
      setError("Lỗi khi đọc file Excel");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Đọc dữ liệu từ cột A của file Excel
   * @param file File Excel được tải lên
   */
  const handleReadColumnA = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const columnData = await readColumnA(file);
      setColumnAData(columnData);
    } catch (err: any) {
      setError("Lỗi khi đọc dữ liệu từ cột A");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    columnAData,
    loading,
    error,
    handleReadExcelFile,
    handleReadColumnA,
  };
}