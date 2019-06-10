export const tableReload = {
    data: function () {
      return {
        reload: true,
        reload1:true,
        reload2:true,
        reload3:true,
        reload4:true,
      }
    },
    methods:{
      afterSetting(cols){
        this.baseReload(cols,"reload");
      },
      afterSetting1(cols){
        this.baseReload(cols,"reload1");
      },
      afterSetting2(cols){
        this.baseReload(cols,"reload2");
      },
      afterSetting3(cols){
        this.baseReload(cols,"reload3");
      },
      afterSetting4(cols){
        this.baseReload(cols,"reload4");
      },
      baseReload(cols,prop){
        var $this =this;
        this[prop] = false;
        //组件强制刷新
        this.$nextTick(()=>{
            $this[prop] = true;
        });
      }
    }
  };