import axiosClient from './axiosClient';

export const getStaffList = (params = {}) =>
  axiosClient.get('/staffs/list', { params });

export const createStaff = (staff) =>
  axiosClient.post('/staffs/create', staff);
