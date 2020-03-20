import request from "../utils/request"

export default {
    //获取会员列表数据
    getlist() {
        return request({
            url: "/member/list",
            method: "get"
        })
    },

    //分页搜索方法
    //page当前页码，size每页查询的条数，searchMap条件查询的条件
    search(page,size,searchMap){
        return request({
            url:`/member/list/search/${page}/${size}`,
            method:"post",
            data:searchMap
        })
    },

    add(pojo){
        return request({
            url:'/member',
            method:"post",
            data:pojo

        })
    },

    //通过id查询会员信息
    getById(id){
        return request({
            url:`/member/${id}`,
            method:"get"
        })
    },
    //通过id更新会员信息
    updateById(pojo){
        return request({
            url:`/member/${pojo.id}`,
            method:"put",
            data:pojo
        })
    },
    //删除会员
    deleteById(id){
        return request({
            url:`/member/${id}`,
            method:"delete",
        })
    }
}