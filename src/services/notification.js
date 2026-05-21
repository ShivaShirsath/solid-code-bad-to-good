let notifier = (payload) => {
  // default to simple alert for demo; consumers should set a better notifier in real apps
  if (typeof payload === 'string') alert(payload);
  else if (payload && payload.message) alert(payload.message);
};

export function notify(payload) {
  return notifier(payload);
}

export function setNotifier(fn) {
  notifier = fn;
}
