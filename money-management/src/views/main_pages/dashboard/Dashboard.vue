<template>
  <div class="wrapper">
    <div class="container-fluid">

      <!-- Page-Title -->
      <div class="row">
        <div class="col-sm-12">
          <div class="page-title-box">

            <h4 class="page-title">Dashboard</h4>
          </div>
        </div>
      </div>
      <!-- end page title end breadcrumb -->

      <div class="row">
        <div class="col-sm-12">
          <div class="alert alert-success alert-dismissable">
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            Welcome to Capital One Money Management App!
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8">
          <div class="card-box">
            <h4 class="text-dark  header-title m-t-0 m-b-30">Monthly Spending</h4>
            <div class="widget-chart text-center">
              <div style="min-width: 200px; min-height: 200px;">

              </div>
              
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card-box">
            <h4 class="text-dark header-title m-t-0 m-b-30">Spending Categories
              <div class="pull-right">
                <router-link :to="{name:'transactions'}" class="text-primary">See All</router-link>
              </div>
            </h4>
            Pie Chart Here
          </div>
        </div>
      </div>
      <!-- end row -->


      <div class="row">
        <div class="col-lg-8">
          <div class="card-box">
            <h4 class="text-dark header-title m-b-30">
              <div class="pull-right">
                <router-link :to="{name:'transactions'}" class="text-primary">See All</router-link>
              </div>
              Latest Transactions
            </h4>
            <table class="table">
              <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Location</th>
                <th>Time</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(tx, index) in transactions" v-if="index<5">
                <td>{{tx.type}}</td>
                <td>{{tx.category}}</td>
                <td>{{tx.payment_method}}</td>
                <td>{{tx.location}}</td>
                <td v-html="timeFromNow(tx.time)"></td>
              </tr>
              </tbody>
            </table>
            <div v-if="!transactions" class="text-center">
              <p>You have no transactions.</p>
              <a class="btn btn-primary" href="https://www.capitalone.com/" target="_blank">Explore</a>
            </div>
          </div>
        </div>
        <!-- end col -8 -->
        <div class="col-lg-4">
          <div class="card-box">
            <h4 class="text-dark header-title">Tips</h4>
            <div class="inbox-widget">
              <a href="https://www.capitalone.com/" target="_blank">
                <div class="inbox-item">
                  <p class="inbox-item-author">100 Ways to Save Money</p>
                  <p class="inbox-item-text">100 Ways to Save Money <span class="pull-right">{{timeFromNow(1)}}</span></p>
                </div>
              </a>
            </div>
          </div>

        </div>

      </div>
      <!-- end row -->

    </div>
    <!-- end container -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      eth_market_data: {}
    };
  },
  computed: {
    ...mapGetters({
      is_login: "is_login",
      me: "me",
      transactions: "transactions"
    })
  },
  methods: {
    timeFromNow(time) {
      return moment(time).fromNow();
    },
    generateLabels() {
      const list_hours = [];
      const d = new Date();
      let hour = d.getHours();
      for (let i = 0; i < 24; i += 1) {
        list_hours.unshift(hour + ":00");
        hour -= 1;
        if (hour === -1) hour += 24;
      }
      return list_hours;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.card-box-no-outline {
  padding: 20px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-bottom: 20px;
  background-color: #ffffff;
}
</style>
