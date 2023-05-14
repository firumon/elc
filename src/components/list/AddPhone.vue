<template>
  <q-list>
    <q-item>
<!--      <q-item-section side><q-item-label class="text-bold">Phone</q-item-label></q-item-section>-->
      <q-item-section><q-input outlined v-model.number="phone" type="number" :label="(voter && voter.PHONE) ? 'Update Phone Number' : 'Add Phone Number'" /></q-item-section>
      <q-item-section side><q-btn round icon="forward" color="primary" :loading="misc.loading" @click="addPhone" /></q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import {computed, onUpdated, reactive} from "vue";
import {useSyncStore} from "stores/sync";
import {useListStore} from "stores/list";

const syncStore = useSyncStore()
const listStore = useListStore()
const props = defineProps(['voter'])
const misc = reactive({ i_phone:'',loading:false })
const phone = computed({
  get(){ return misc.i_phone || props.voter ?. PHONE || '' },
  set(ph){ misc.i_phone = ph },
})
function addPhone(){
  misc.loading = true;
  listStore.voters[props.voter.ID]['PHONE'] = phone.value;
  syncStore.setPhone(props.voter.ID,phone.value)
  setTimeout(() => {
    misc.loading = false
    misc.i_phone = '';
  },1500)
}
onUpdated(() => misc.i_phone = '')
</script>
