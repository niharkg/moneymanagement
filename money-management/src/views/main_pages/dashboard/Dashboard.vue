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
          <div id="spending_alert" >
            <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
            {{ this.alertText }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-8">
          <div class="card-box">
            <h4 class="text-dark  header-title m-t-0 m-b-30">Monthly Spending</h4>
            <div class="widget-chart text-center">
              <div style="min-width: 200px; min-height: 200px;">
                <canvas style="width: 100%; height: 250px;" id="monthly-chart"></canvas>
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
            <canvas style="width: 100%; height: 250px;" id="category-chart"></canvas>
          </div>
        </div>
      </div>
      <!-- end row -->


      <div class="row">
        <div class="col-lg-8">
          <div class="card-box" style="height:400px;">
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
          <div class="card-box" style="height:400px;">
            <h4 class="text-dark header-title">Tips</h4>
            <div class="inbox-widget">
              <a href="https://creditwise.capitalone.com/home" target="_blank">
                <div class="inbox-item">
                  <p class="inbox-item-author">CreditWise</p>
                  <p class="inbox-item-text">Monitor your credit. For free. <span class="pull-right"></span></p>
                </div>
              </a>
              <a href="https://www.capitalone.com/credit-cards/savor-dining-rewards/" target="_blank">
                <div class="inbox-item">
                  <p class="inbox-item-author">Savor® Cash Back Rewards</p>
                  <p class="inbox-item-text">Earn unlimited 4% cash back on dining and entertainment. <span class="pull-right"></span></p>
                </div>
              </a>
              <a href="https://creditwise.capitalone.com/home" target="_blank">
                <div class="inbox-item">
                  <p class="inbox-item-author">Expect more with 360 Money Market®</p>
                  <p class="inbox-item-text">Grab one of the nation's top savings rates with this fee-free, online and mobile account. <span class="pull-right"></span></p>
                </div>
              </a>
              <a href="https://creditwise.capitalone.com/home" target="_blank">
                <div class="inbox-item">
                  <p class="inbox-item-author">See If You're Pre-Qualified</p>
                  <p class="inbox-item-text">Are you eligible for pre-qualified credit card offers? There's no impact to your credit score to find out now.. <span class="pull-right"></span></p>
                </div>
              </a>
              <a href="https://creditwise.capitalone.com/home" target="_blank">
                <div class="inbox-item">
                  <p class="inbox-item-author">Auto Navigator</p>
                  <p class="inbox-item-text">Find your perfect car, and get pre-qualified for financing—all with no impact to your credit score. <span class="pull-right"></span></p>
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
      categorySpendings: [],
      alertType: "",
      alertText: "",
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
    // Generate labels for transactions?
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
    getRecentTransactions(user_id, amount) {
      let params = {}
      params.user_id = this.me.user_id
      params.amount = 5
      console.log(params)
      this.$store.dispatch("getRecentTransactions", params).then(result => {
        this.transactions = result
      });
    },
    // Get the category breakdown spending for the current month
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
    },
    // Get colors for the bars in the bar chart (leveraging spending)
    getBarColors(spendings) {
      let threshold = 0.03
      let bad = "#D22F2F"
      let ok = "#004879"
      let good = "#2DCB76"
      let total = 0
      let active_months = 0
      for(let spending of spendings) {
        if(spending != null) {
          total += spending
          active_months += 1
        }
      }
      let avg = total / active_months
      this.sendSpendingAlert(avg, threshold, spendings[spendings.length - 1])
      let colors = []
      for (let spending of spendings) {
        if (spending >= avg + avg*threshold){
          colors.push(bad)
        }
        else if (spending <= avg - avg*threshold) {
          colors.push(good)
        }
        else {
          colors.push(ok)
        }
      }
      return colors
    },
    // Alert the user of current spending
    sendSpendingAlert(avg, threshold, month_spending) {
      const ctx = document.getElementById("spending_alert");
      if (month_spending == null)
        month_spending = 0
      month_spending = month_spending.toFixed(2)
      let percent_diff = Math.abs(((avg - month_spending) / avg) * 100).toFixed(1)
      if (month_spending >= avg + avg*threshold){
        this.alertType = "danger"
        this.alertText = "Uh-oh, you're spending more than usual this month. Your spending is $" + month_spending + ". This is " + percent_diff + "% higher than usual."
        ctx.className = "alert alert-danger alert-dismissable"
      }
      else if (month_spending <= avg - avg*threshold) {
        this.alertType = "success"
        this.alertText = "You're doing great this month! Your spending is $" + month_spending + ". This is " + percent_diff + "% lower than usual."
        ctx.className = "alert alert-success alert-dismissable"
      }
      else {
        this.alertType = "info"
        this.alertText = "Your spending is right on track this month! Your spending is $" + month_spending +". This is " + percent_diff + "% different than usual."
        ctx.className = "alert alert-info alert-dismissable"
      }
    },
    // Create the bar monthly spending chart
    createBarChart(chartId, months, spendings) {
      let colors = this.getBarColors(spendings);
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              backgroundColor: colors,
              data: spendings,
            }
          ]
        },
        options: {
          title: {
            display: false,
          },
          legend: {
            display: false,
          }
        }
      });
    },
    // Get the user's total spending for the last year
    getLastYearMonthlySpending() {
      this.$store.dispatch("getLastYearMonthlySpending", this.me.user_id).then(result => {
        let months = result[0]
        let spendings = result[1]
        this.createBarChart("monthly-chart", months, spendings)
      });
    }
  },
  // Call these functions before the page loads (mounts)
  beforeMount() {
    var d = new Date();
    // TODO: Fix month (User data not in October yet)
    this.getCurrentMonthCategorySpendings(d.getMonth() - 1, d.getFullYear())
    this.getRecentTransactions();
    this.getLastYearMonthlySpending();
  },
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
