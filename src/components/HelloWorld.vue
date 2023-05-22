<template>
  <div>
    <p>{{ defaultText }}</p>
    <div id="maintable"><br /></div>
    <!--テーブル生成位置-->
    <br />
    <br />
    <h6 id="MultiHighlight">
      マルチハイライト<span class="c-tooltip" data-tooltip="ハイライトしたいページで『Alt + クリック』(Alt + Shift + クリック >> 消去)">?</span>
    </h6>
    <br />
    <br />
    <form>
      <b-button-group size="sm">
        <b-button name="options" pill variant="outline-info" id="indention" autocomplete="off" @click="indention">
          改行
        </b-button>
        <b-button name="options" pill variant="outline-info" id="boolean" autocomplete="off" @click="boolean">
          ブーリアン
        </b-button>
      </b-button-group>
      <!-- <b-form-group>
        <textarea id="memo" class="form-control" rows="5" v-model="textData.value" @change="change"></textarea>
        <b-button v-b-toggle.sidebar-ngset-right variant="outline-secondary">NG Set</b-button>
        <b-sidebar id="sidebar-ngset-right" :backdrop-variant="variant" backdrop right shadow>
          <div class="px-3 py-2">
            <b-form-group label="NG Set">
              <b-form-checkbox-group id="ngset_list" v-model="selected" :options="options"
                :aria-describedby="ariaDescribedby" name="ngset" @change="ngset_list" stacked>
              </b-form-checkbox-group>
            </b-form-group>
          </div>
        </b-sidebar>
      </b-form-group>
      <b-button id="save" pill variant="outline-info" @click="save" size="sm">保存</b-button>
      <b-button id="clear" pill variant="outline-info" @click="clear" size="sm">削除</b-button> -->
      <br />
    </form>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted () {
    browser.runtime.sendMessage({})
  },
  computed: {
    defaultText () {
      return browser.i18n.getMessage('extName')
    }
  }
}
</script>

<style scoped>
div#home {
  margin: 10px;
}

h6#PastSenderSearch,
#MultiHighlight {
  display: inline-block;
  border-bottom: 1px solid #ddd;
}

.btn {
  margin: 10px;
}
</style>
