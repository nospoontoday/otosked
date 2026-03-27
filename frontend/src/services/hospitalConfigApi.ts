export const hospitalConfigApi = {
  save: async (payload: any) => {
    return fetch('/api/hospital-config', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};