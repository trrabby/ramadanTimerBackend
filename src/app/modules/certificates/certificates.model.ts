import { Schema, model } from 'mongoose';
import { ICertificate } from './certificates.interface';

const CertificateSchema = new Schema<ICertificate>(
  {
    category: {
      type: String,
      enum: ['academic', 'non-academic', 'professional'],
      required: true,
    },
    institute: { type: String, required: true },
    instituteLogo: { type: String },
    nameOfDegree: { type: String, required: true },
    nameOfMajor: { type: String },

    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    currentlyStuding: { type: Boolean, default: false },
    certificateLink: { type: String },
    credentialLink: { type: String },
    details: { type: Schema.Types.Mixed, required: true },
    thumbnails: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const CertificateModel = model<ICertificate>(
  'Certificate',
  CertificateSchema,
);
