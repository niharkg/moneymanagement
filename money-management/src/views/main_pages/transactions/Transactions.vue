<template>
  <div class="wrapper" v-if="transactions">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="page-title-box">
            <h4 class="page-title">My Wallet</h4>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="card-box">
            <h4 class="text-dark header-title m-b-30">Transactions</h4>
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
            <div v-if="!transactions.length" class="text-center">
              <p>You have no transactions.</p>
              <button class="btn btn-primary">
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Transactions",

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
    formatTime(time) {
      return moment(time).fromNow();
    },
    getRecentTransactions() {
      this.$store.dispatch("getRecentTransactions").then(result => {
        this.transactions = result;
      });
    },
    getCurrentMonthCategorySpendings(month, year) {
      let params = {};
      params.month = month;
      params.year = year;
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
    }
  },
  created() {}
};
</script>

<style scoped>
.m-widget5 .m-widget5__item {
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
