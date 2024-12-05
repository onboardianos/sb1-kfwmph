import AwsService from "@services/awsService";
import { BASE_URL } from "..";

const getDocumentById = async (id: number): Promise<IDocument> => {
  const token = await AwsService.getAwsToken();
  const res = await fetch(`${BASE_URL}/my/documents/${id}`, {
    headers: {
      'Authorization': token
    }
  })
  if (!res.ok) {
    throw new Error('Failed to fetch document');
  }
  let data = await res.json();

  return data
}

const DocumentService = {
  getDocumentById
}

export default DocumentService;