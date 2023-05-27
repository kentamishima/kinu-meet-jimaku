<template>
  <div>
    <p>{{ defaultText }}</p>
    <div id="maintable"><br /></div>
    <!--テーブル生成位置-->
    <br />
    <br />
    <h6 id="MultiHighlight">
      Meet no Jimaku
    </h6>
    <br />
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
