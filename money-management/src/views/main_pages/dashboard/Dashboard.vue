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
            <h4 class="text-dark header-title m-t-0 m-b-30">Spending This Month
              <div class="pull-right">
                <router-link :to="{name:'transactions'}" class="text-primary">See All</router-link>
              </div>
            </h4>
            <canvas id="category-chart"></canvas>
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
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Vendor</th>
                <th>Location</th>
              </tr>
              </thead>
              <tbody>
              <!-- User Transactions Concise Table -->
              <tr v-for="(tx, index) in transactions" v-if="index<8">
                <td>{{tx.sale_date.slice(0, 10)}}</td>
                <td>{{tx.sale_date.slice(11, 16)}}</td>
                <td>${{tx.amount.toFixed(2)}}</td>
                <td>{{tx.category}}</td>
                <td>{{tx.payment_method}}</td>
                <td>{{tx.location.vendor_name}}</td>
                <td>{{tx.location.city}}, {{tx.location.state}}</td>
              </tr>
              </tbody>
            </table>
            <div v-if="!transactions" class="text-center">
              <p>You have no transactions.</p>
              <button class="btn btn-primary">
                Explore
              </button>
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
// import Chart from 'chart.js'

export default {
  name: "Dashboard",
  data() {
    return {
      transactions: {},
      categorySpendings: {},
      categories: [],
      categorySpendings: []
    };
  },
  computed: {
    ...mapGetters({
      is_login: "is_login",
      me: "me"
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
    },
    // Retrieve all of a user's transactions
    getTransactoinsByPage() {
      this.$store.dispatch("getTransactoinsByPage", 1).then(response => {
        this.transactions = response;
      });
    },
    getCurrentMonthCategorySpendings(month, year) {
      let params = {
        month: month,
        year: year
      };

      this.$store
        .dispatch("getCurrentMonthCategorySpendings", params)
        .then(result => {
          this.categorySpendings = result;
          let months = Object.keys(this.categorySpendings);
          this.categories = Object.keys(this.categorySpendings[months[0]]);
          let spendings = [];
          for (let category of this.categories) {
            spendings.push(
              this.categorySpendings[months[0]][category].toFixed(2)
            );
          }
          this.categorySpendings = spendings;
          this.createDonutChart("category-chart");
        });
    },
    // Create the donut category chart
    createDonutChart(chartId) {
      console.log(this.categorySpendings);
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: this.categories,
          datasets: [
            {
              backgroundColor: [
                "#FE0000",
                "#017DD7",
                "#2DCB76",
                "#FFEC02",
                "#9D46C9",
                "#63B5D3",
                "#4FDA22",
                "#FE7F16",
                "#809BE5",
                "#26D7AD"
              ],
              data: this.categorySpendings
            }
          ]
        },
        options: {
          title: {
            display: false
          },
          legend: {
            display: false
          }
        }
      });
    }
  },
  // Call these functions before the page loads (mounts)
  beforeMount() {
    var d = new Date();
    // TODO: Fix month (User data not in October yet)
    this.getCurrentMonthCategorySpendings(d.getMonth() - 1, d.getFullYear());
    this.getTransactoinsByPage();
  }
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
