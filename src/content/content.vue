<script setup>
import { ref } from 'vue'
import MainDialog from '@/content/components/mainDialog/mainDialog.vue'
import { onMounted } from 'vue'
import * as XLSX from 'xlsx'
import {DARK_MASK_OPACITY, DARK_MASK_COLOR} from '@/common/js.common.js'

const levitatedSphereCategoryIsSun = ref(true); // 悬浮球icon种类 true:sun / false: moon
const darkMaskopacityValue = ref(DARK_MASK_OPACITY); 

function levitatedSphereClickFunc() {
    levitatedSphereCategoryIsSun.value = !levitatedSphereCategoryIsSun.value;
}

onMounted(() => {
    // 监听链接
    try{
        chrome.runtime.onConnect.addListener(res => {
            if (res.name == "popup") {
                res.onMessage.addListener(mes => {
                    console.log('🥓: popup.js receive', mes, levitatedSphereCategoryIsSun.value);
                    res.postMessage('📣: popup.js receiveBack')
                    darkMaskopacityValue.value = mes;
                });
            }else if (res.name == 'colorChange') { // 选取颜色
                res.onMessage.addListener(mes => {

                })
            } else if (res.name == 'exportDataEvent') { // 快团团数据导出
                res.onMessage.addListener(mes => {
                    let table_ele = document.getElementsByClassName("TB_tableWrapper_15w5x36")
                    let table_data = table_ele[0].children[2].children
                    let table_head_data = table_ele[0].children[1].children[0].children;
                    let get_table_array_data = []
                    let table_head_array_data = []
                    
                    // length -1 不要最后一列
                    for(let i=0;i<table_head_data.length-1;i++) {
                        
                        table_head_array_data.push(table_head_data[i].innerText)
                        console.log(table_head_data[i].innerTexts)
                    }
                    console.log(table_head_array_data)
                    get_table_array_data.push(table_head_array_data)
                    
                    for(let i=0;i<table_data.length;i++){
                        let children_data = table_data[i].children
                        let get_table_child_array_data = []
                        for(let j=0;j<children_data.length-1;j++){
                            let value_data = children_data[j].innerText
                            value_data = value_data.replace('￥', '');
                            get_table_child_array_data.push(value_data);
                        }
                        get_table_array_data.push(get_table_child_array_data)
                    }
                    console.log(get_table_array_data)
                    var ws = XLSX.utils.aoa_to_sheet(get_table_array_data);
                    var wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                    // console.log(getNowDate())
                    let now_date = getNowDate().now_date
                    XLSX.writeFile(wb, `${now_date}-快团团数据.xlsx`);

                    // var table_elt = document.getElementsByClassName("TB_tableWrapper_15w5x36")[0];
                    // var workbook = XLSX.utils.table_to_book(table_elt);l——
                    // console.log(workbook)
                    // XLSX.writeFile(workbook, "Report.xlsx");
                })
            }
        });
    }catch(error){
        console.log(error)
    }
})

function getNowDate() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let now_date = `${year}-${month}-${day}`
    return {now_date}
}

</script>

<template>
    <el-config-provider namespace="CRX-el">
        <!-- <div class="CRX-content"> -->
            <div :class="['content-entry', levitatedSphereCategoryIsSun ? 'content-entry-sun' : 'content-entry-moon']"
                @click="levitatedSphereClickFunc()"></div>
            <!-- <MainDialog :visible="isShowMainDialog" @onClose="() => { isShowMainDialog = false }" /> -->
        <!-- </div> -->
        <div class="CRX-dark-mask" v-show="!levitatedSphereCategoryIsSun" :style="{opacity: darkMaskopacityValue}">
        </div>
    </el-config-provider>
</template>

<style scoped lang="stylus">
.CRX-content
    position: absolute
    top:0
    left:0
    width: 100%
    height: 100%
.content-entry
    position: fixed
    z-index: 99999
    bottom: 100px
    right: 20px
    width: 50px
    height: 50px
    background-size: 100% 100%
    cursor: pointer
.content-entry-sun
    background-image: url('images/sun.png')
.content-entry-moon
    background-image: url('images/moon.png')
.CRX-dark-mask
    position : fixed
    top:0
    left:0
    width: 100%
    height: 100%
    background-color: gray
    z-index: 9999
    pointer-events: none
</style>