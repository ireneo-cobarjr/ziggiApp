<template>
  <q-page>
    <div v-if="spinLoader" class="loader-spinner">
      <q-spinner
        color="accent"
        size="3em"
      />
    </div>
    <div v-else>
        <q-list separator padding>
          <q-expansion-item v-for="(outlet, index) in outlets" :key="index" class="q-py-lg">
              <template v-slot:header>
                <q-item-section top avatar>
                    <q-avatar color="primary" text-color="white" icon="store" />
                </q-item-section>
                <q-item-section>
                    <q-item-label class="text-weight-bold text-h6 text-capitalize">{{ outlet.name }}</q-item-label>
                    <q-item-label>{{ outlet.address.address }}</q-item-label>
                    <q-item-label>{{ `${outlet.address.city} ${outlet.address.zip}` }}</q-item-label>
                </q-item-section>
              </template>
            <div class="open-hours">
                <q-chip>
                    <q-avatar color="secondary" text-color="white" icon="schedule" />
                    Store Hours
                </q-chip><br/>
                <span class="day">Sunday</span><span>{{`${outlet.open_hours.su_from} - ${outlet.open_hours.su_until}`}}</span><br/>
                <span class="day">Monday</span><span>{{`${outlet.open_hours.mo_from} - ${outlet.open_hours.mo_until}`}}</span><br/>
                <span class="day">Tuesday</span><span>{{`${outlet.open_hours.tu_from} - ${outlet.open_hours.tu_until}`}}</span><br/>
                <span class="day">Wednesday</span><span>{{`${outlet.open_hours.we_from} - ${outlet.open_hours.we_until}`}}</span><br/>
                <span class="day">Thursday</span><span>{{`${outlet.open_hours.th_from} - ${outlet.open_hours.th_until}`}}</span><br/>
                <span class="day">Friday</span><span>{{`${outlet.open_hours.fr_from} - ${outlet.open_hours.fr_until}`}}</span><br/>
                <span class="day">Saturday</span><span>{{`${outlet.open_hours.sa_from} - ${outlet.open_hours.sa_until}`}}</span><br/>
            </div>
          </q-expansion-item>
        </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      spinLoader: true
    }
  },
  mounted () {
    this.$emit('setTitle', 'Outlets')
  },
  computed: {
    outlets () {
      return this.$store.state.outlets.outlets
    }
  },
  async created () {
    await this.$store.dispatch('outlets/getOutlets')
    this.spinLoader = false
  }
}
</script>

<style lang="scss" scoped>
  .loader-spinner {
      position: absolute;
      top: 40%;
      left: calc(50% - 1.5em);
  }
  .open-hours {
      padding: 1rem 1.2rem;
      .day {
          display: inline-block;
          margin-left: 12px;
          margin-top: 5px;
          width: 7rem;
      }
  }
</style>
