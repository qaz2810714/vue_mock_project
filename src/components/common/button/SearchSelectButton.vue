<template>
    <div>
     <el-autocomplete size="mini"
        popper-class="my-autocomplete"
        v-model="field.value"
        :fetch-suggestions="querySearch(field.fieldName)"
        placeholder="请输入内容"
        @select="handleSelect">
        <i
          class="el-icon-edit el-input__icon"
          slot="suffix"
          @click="handleIconClick">
        </i>
        <template slot-scope="{ item }">
          <div class="name">{{ item.value }}</div>
          <span class="desc">{{ item.desc }}</span>
        </template>
      </el-autocomplete>
    </div>
</template>

<script>
  import cacheUtil from '@/common/utils/CacheUtil';
  export default {
    props: {
        field: {
            type: Object,
            default() {
                return {
                    fieldName:"brandId",
                    dataSource: []
                }
            }
        }
    },
    methods: {
        querySearch(val) {
            return(queryString,cb) =>{
                var data = this.field.dataSource;
                var results = queryString ? data.filter(this.createFilter(queryString)) : data;
                // 调用 callback 返回建议列表的数据
                cb(results);
            }
        },
      createFilter(queryString) {
          return (data) => {if(data.value)
          return (data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
      },        
      handleSelect(item) {
        var brandMap = new Map();
        var textureMap = new Map();
        var producingMap = new Map();
        var userMap = new Map();
        this.brands.forEach(brand => {
            brandMap.set(brand.name,brand.model.id);
        });
        this.textures.forEach(texture => {
            textureMap.set(texture.name,texture.model.id);
        });
        this.producings.forEach(producing => {
            producingMap.set(producing.name,producing.model.id);
        });
        this.users.forEach(user => {
            userMap.set(user.model.name,user.model.id);
        });
        if(this.field.fieldName=="brandId"){//品名控件 把value值转化为id传出
            this.field.id = brandMap.get(item.value);
        }
        if(this.field.fieldName=="textureId"){//材质
            this.field.id = textureMap.get(item.value);
        }
        if(this.field.fieldName=="producingId"){//产地
            this.field.id = producingMap.get(item.value);
        }
        if(this.field.fieldName=="userId"){//用户
            this.field.id = userMap.get(item.value);
        }
      },
      handleIconClick(ev) {
      },
      getDataSource(){
          this.brands = cacheUtil.getDic().DicBrandName.list;
          this.producings = cacheUtil.getDic().DicProducingName.list;
          this.textures = cacheUtil.getDic().DicTextureName.list;
          this.users = cacheUtil.getDic().DicUser.list;
          if(this.field.fieldName=="brandId"){
            this.field.dataSource = this.brands.map(obj => {
                return {
                    ...obj,
                    value:obj.name,
                    desc:obj.model.mnemonicCode,
                }
            });
          }
          if(this.field.fieldName=="textureId"){
            this.field.dataSource = this.textures.map(obj => {
                return {
                    ...obj,
                    value:obj.name,
                    desc:obj.model.mnemonicCode,
                }
            });
          }
          if(this.field.fieldName=="producingId"){
             this.field.dataSource = this.producings.map(obj => {
                return {
                    ...obj,
                    value:obj.name,
                    desc:obj.model.mnemonicCode,
                }
            });
          }
          if(this.field.fieldName=="userId"){
            this.field.dataSource = this.users.map(obj => {
                return {
                    ...obj,
                    value:obj.model.name,
                    desc:obj.model.remark,
                }
            });
          }
      }
    },
    mounted() {
      this.getDataSource()
    },
    data() {
      return {
        brands: [],
        textures: [],
        producings: [],
        users: []
      };
    },
}
</script>


<style>
.my-autocomplete li{
    line-height: normal;
    padding: 7px;
}

.my-autocomplete li .name {
      text-overflow: ellipsis;
      overflow: hidden;
}
.my-autocomplete li   .desc {
      font-size: 12px;
      color: #b4b4b4;
    }

.my-autocomplete li   .highlighted .desc {
      color: #ddd;
}
</style>