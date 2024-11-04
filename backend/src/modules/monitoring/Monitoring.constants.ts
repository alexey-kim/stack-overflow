export const RequestIdKey = 'RequestId';

export const MorganLoggingFormat = `[:${RequestIdKey}] [:date[iso]] :remote-addr :method :url HTTP/:http-version, status: :status, response time: :response-time ms, content length: :res[content-length], user-agent: :user-agent`;
