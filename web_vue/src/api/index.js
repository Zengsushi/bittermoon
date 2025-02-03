import instance from "@/utils/result"

export const useInfo = (data) => {
    return instance.get('/dormitoryAdmin/login',data);
}