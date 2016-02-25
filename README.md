# Some operations against ElasticSearch on node.js

Given an ES with `product` index that stores document such as following:
```
{
  "product_id": 5,
  "name": "Pianemo Snorkeling Package (Start From Waisai)",
  "slug": "pianemo-snorkeling-package-start-from-waisai",
  "destination": "Pianemo",
  "city": "Wayag",
  "region": "Papua Barat",
  "country": "Indonesia",
  "continent": "Asia",
  "image": "https://s3-ap-southeast-1.amazonaws.com/media.tripvisto.com/images/1c7235e57dbefbeba5e66eb288b30f76.jpg",
  "categories": [
    "Outdor Activities",
    "Tours",
    "Boat Tours & Water Sports"
  ],
  "duration_days": 5,
  "start_price_from": 4500000,
  "currency": "IDR"
}
```

## Search
Simple search in all index. `term` won't work if the value more than
a word, `match` family might be the right things to use in the case.

```
GET _search
{
  "query": {
    "term": {
      "country": "indonesia"
    }
  },
  "sort": [
    {
      "start_price_from": "desc"
    }
  ]
}
```

When we want to match a search term in a multiple fields, we can use
`match_all` as shown in the following snippet.
```
GET /products/_search
{
  "query": {
    "multi_match": {
      "query": "sulawesi",
      "fields": ["destination", "city", "region", "country", "continent"]
    }
  }
}
```
The results are documents that have _sulawesi_ keyword in either one of its
`destination`, `city`, `region`, `country` or `continent` field.

When needed, we can build more complex query such as following.
```
GET /products/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "sulawesi",
            "fields": ["destination","city","region","country","continent"]
          }
        }
      ],
      "filter": [
        {
          "terms": {
            "categories.raw": ["Outdor Activities", "Boat Tours & Water Sports"]
          }
        },
        {
          "term": {
            "available": "2016-03-04"
          }
        }
      ]
    }
  }
}
```
`bool` [boolean matched](https://www.elastic.co/guide/en/elasticsearch/reference/2.2/query-dsl-bool-query.html)
the queries given to it, in the above case are `must` and `filter`. `filter`
only filters the documents but without contributes to the overall search
score.

## Aggregation
On aggregation, simple aggregation query is as following snippet:
```
GET /products/_search
{
  "query": {
    "match": {
      "region": "sulawesi utara"
    }
  },
  "aggs": {
    "product_count": {
      "terms": {
        "field": "city"
      }
    }
  }
}
```
where `match` matching the given string. `match` can be used for string
valued field that has multiwords values.

When we want to aggregate a field that its values is array, we have to make
sure that the field has the right mapping: using `raw`.

```
PUT products
{
  "mappings": {
    "tour": {
      "properties": {
        "categories": {
          "type": "string",
          "fields": {
            "raw":   { "type": "string", "index": "not_analyzed" }
          }
        }
      }
    }
  }
}
```
Then, to aggregate `category` field, the following query can be used.
```
GET /products/_search
{
  "query": {
    "match": {
      "city": "manado"
    }
  },
  "size": 0,
  "aggs": {
    "categories": {
      "terms": {
        "field": "categories.raw"
      }
    }
  }
}
```
`category.raw` needs to be used so that ElasticSearch aggregates the whole
string instead of only by terms (words).

# Delete
To delete an index, use the following query.
```
DELETE products
```

## References

[https://bonsai.io/2016/01/11/ideal-elasticsearch-cluster](https://bonsai.io/2016/01/11/ideal-elasticsearch-cluster)
