import mongoose, { Document, Schema } from 'mongoose';

interface IErrorLog extends Document {
  message: string;
  error: string;
  stack?: string;
  endpoint?: string;
  method?: string;
  userId?: string;
  timestamp: Date;
}

const errorLogSchema = new Schema<IErrorLog>({
  message: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    required: true,
  },
  stack: String,
  endpoint: String,
  method: String,
  userId: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ErrorLog = mongoose.model<IErrorLog>('ErrorLog', errorLogSchema);

interface LogErrorParams {
  message: string;
  error: string;
  stack?: string;
  endpoint?: string;
  method?: string;
  userId?: string;
}

export const logError = async (params: LogErrorParams): Promise<void> => {
  try {
    await ErrorLog.create({
      message: params.message,
      error: params.error,
      stack: params.stack,
      endpoint: params.endpoint,
      method: params.method,
      userId: params.userId,
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', params);
    }
  } catch (logError) {
    console.error('Failed to log error to database:', logError);
    console.error('Original error:', params);
  }
};

export default ErrorLog;