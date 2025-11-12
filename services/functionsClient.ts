import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import type { UploadedFile } from '../types';

export interface CreativeBriefRequest {
  creativeGoal: string;
  referenceImageUrl?: string;
}

export interface CreativeBriefResponse {
  aspectRatio?: string;
  cameraAngle?: string;
  modelType?: string;
  environment?: string;
  presentation?: string;
  mood?: string;
  colorGrading?: string;
  lighting?: string;
  realismLevel?: string;
  skinTexture?: string;
  hairDetail?: string;
  manipulationStyle?: string;
}

export interface CampaignImageRequest {
  masterPrompt: string;
  aspectRatio: string;
  referenceImageUrl?: string;
}

export interface CampaignImageResponse {
  images: string[];
  prompt: string;
}

export interface CaptionRequest {
  imageUrl: string;
}

export interface CaptionResponse {
  english: string;
  hindi: string;
  hinglish: string;
  seductiveEnglish: string;
  seductiveHindi: string;
  seductiveHinglish: string;
}

export interface WebsiteConceptRequest {
  url: string;
}

export interface WebsiteConcept {
  title: string;
  description: string;
}

export interface RazorpayOrderPayload {
  amount: number;
  currency?: string;
  planId?: string;
  receipt?: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export const createStudioSession = async (payload: Record<string, unknown>) => {
  const callable = httpsCallable(functions, 'createStudioSession');
  const { data } = await callable(payload);
  return data as Record<string, unknown>;
};

export const generateCreativeBrief = async (payload: CreativeBriefRequest) => {
  const callable = httpsCallable(functions, 'generateCreativeBrief');
  const { data } = await callable(payload);
  return data as CreativeBriefResponse;
};

export const generateCampaignImages = async (payload: CampaignImageRequest) => {
  const callable = httpsCallable(functions, 'generateCampaignImages');
  const { data } = await callable(payload);
  return data as CampaignImageResponse;
};

export const generateImageCaptions = async (payload: CaptionRequest) => {
  const callable = httpsCallable(functions, 'generateImageCaptions');
  const { data } = await callable(payload);
  return data as CaptionResponse;
};

export const analyzeWebsiteForConcepts = async (payload: WebsiteConceptRequest) => {
  const callable = httpsCallable(functions, 'analyzeWebsiteForConcepts');
  const { data } = await callable(payload);
  return data as WebsiteConcept[];
};

export const createRazorpayOrder = async (payload: RazorpayOrderPayload) => {
  const callable = httpsCallable(functions, 'createRazorpayOrder');
  const { data } = await callable(payload);
  return data as RazorpayOrderResponse;
};

