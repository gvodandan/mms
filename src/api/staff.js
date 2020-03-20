import request from "../utils/request"

export default {
    //获取员工列表数据
    getlist() {
        return request({
            url: "/staff/list",
            method: "get"
        })
    },

    //分页搜索方法
    //page当前页码，size每页查询的条数，searchMap条件查询的条件
    search(page,size,searchMap){
        return request({
            url:`/staff/list/search/${page}/${size}`,
            method:"post",
            data:searchMap
        })
    },

    add(pojo){
        return request({
            url:'/staff',
            method:"post",
            data:pojo

        })
    },

    //通过id查询员工信息
    getById(id){
        return request({
            url:`/staff/${id}`,
            method:"get"
        })
    },
    //通过id更新员工信息
    updateById(pojo){
        return request({
            url:`/staff/${pojo.id}`,
            method:"put",
            data:pojo
        })
    },
    //删除员工
    deleteById(id){
        return request({
            url:`/staff/${id}`,
            method:"delete",
        })
    }
}