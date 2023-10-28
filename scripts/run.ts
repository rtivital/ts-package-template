import signale from 'signale';

interface RunMessages {
  info: string;
  success: string;
  error: string;
}

export async function run<T>(script: Promise<T>, messages: RunMessages) {
  signale.info(messages.info);
  try {
    const response = await script;
    signale.success(messages.success);
    return response;
  } catch (err) {
    signale.error(messages.error);
    signale.error(err);
    process.exit(1);
  }
}
