import { useEffect, useState } from "react";
import { Test } from "@/types/class";
import { TestService } from "@/services/test-service";

const testService = new TestService();

export function useTests() {
  const [data, setData] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    testService
      .getTests()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useTestManagement() {
  const [loading, setLoading] = useState(false);

  const createTest = async (testData: Omit<Test, "id">) => {
    setLoading(true);
    try {
      // For now, just simulate creating a test
      // In a real app, you'd call testService.createTest(testData)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Creating test:", testData);
      return testData as Test;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createTest, loading };
}
