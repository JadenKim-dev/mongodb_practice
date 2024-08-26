# ✏️ test6 오답노트

Practive Test 후 몰랐거나 헷갈린 내용, 새롭게 공부한 내용 등을 정리합니다.

## 결과

![Alt text](./images/test6.png)

## 오답 정리

### 1. geospatial data 안티 패턴

geospatial 데이터를 geospatial 데이터 타입 대신 문자열로 저장하는 것은 geospatial 데이터를 다루는 MongoDB 데이터 모델링에서 anti-pattern으로 간주됩니다.  
geospatial 데이터를 문자열로 저장하면 MongoDB가 지리 작업을 수행하기 위해 문자열을 geospatial 데이터 타입으로 파싱해야 하므로 쿼리 성능이 느려질 수 있습니다.  
또한, geospatial data를 문자열로 저장하면 문자열 데이터 유형에서는 일부 지리 작업이 지원되지 않을 수 있으므로 geospatial 데이터 작업의 기능이 제한될 수 있습니다.

#### `$geoWithin` 연산자의 주요 역할

`$geoWithin` 연산자는 MongoDB에서 지리공간 쿼리를 수행할 때 사용되는 연산자로, 지정된 도형(geometry) 내에 위치한 지리적 데이터를 검색하는 데 사용됩니다.  
주로 `2dsphere` 또는 `2d` 인덱스와 함께 사용되며, 다양한 지리적 형태 (예: 다각형, 원, 박스 등) 내의 데이터를 효율적으로 쿼리할 수 있습니다.

1. **지정된 영역 내의 문서 찾기**:
    - `$geoWithin` 연산자는 특정 지리적 경계 또는 도형(예: 다각형, 원, 박스) 내에 위치한 문서를 찾아 반환합니다. 예를 들어, 특정 도시나 지역 내에 위치한 모든 지점들을 찾고자 할 때 사용할 수 있습니다.
2. **다양한 지리적 도형 지원**:
    - `$geoWithin`은 다양한 지리적 도형을 지원합니다. 예를 들어, 다각형, 원, 사각형 등의 도형을 정의하여 그 안에 포함되는 위치 데이터를 검색할 수 있습니다.
    - **Polygon (다각형)**: 특정 다각형 영역 내의 데이터를 찾을 수 있습니다.
    - **Circle (원)**: 특정 중심점과 반경을 기준으로 원 내의 데이터를 찾을 수 있습니다.
    - **Box (사각형)**: 특정 좌표를 바탕으로 사각형 영역 내의 데이터를 찾을 수 있습니다.
3. **지리적 인덱스와 함께 사용**:
    - `$geoWithin` 연산자는 지리적 인덱스(`2dsphere` 또는 `2d` 인덱스)와 함께 사용됩니다. 
    - 인덱스가 없으면, 성능 저하를 초래할 수 있으므로, 지리적 데이터에 대한 쿼리 성능을 높이기 위해 인덱스를 설정하는 것이 중요합니다.

### 사용 예시

다음은 다각형 내의 위치를 찾는 예시입니다:

```js
db.places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [0, 0],
          [3, 6],
          [6, 1],
          [0, 0]
        ]]
      }
    }
  }
});

```

이 쿼리는 주어진 다각형 내에 위치한 모든 `places` 컬렉션의 문서를 반환합니다.

**→ 인덱스만 잘 설정되어있다면 많이 사용해도 문제 없다!**

### transactional data에 대한 안티 패턴

정답) 관련 데이터를 업데이트하기 위해 필요한 업데이트 작업의 수를 줄이기 위해 데이터를 비정규화하는 것은 안티 패턴이다.
→ 데이터 일관성 문제를 초래할 수 있으며 데이터 무결성을 유지하는 데 어려움을 겪을 수 있습니다.  
데이터가 비정규화되면 관련 데이터를 여러 위치에서 업데이트해야 하므로 데이터 불일치 가능성이 높아질 수 있습니다.  
또한, 데이터 비정규화는 엔터티 간의 관계를 유지하기 어렵게 만들어, 관련 데이터를 검색하거나 필요한 업데이트를 수행하는 것이 더 어려워질 수 있습니다.

#### 모든 트랜잭션 데이터를 하나의 컬렉션에 저장하는 것의 장단점

**장점**

1. **단순성**: 모든 데이터를 하나의 컬렉션에 저장하면 데이터 구조가 단순해지고, 쿼리와 인덱스를 설정하기가 쉬워집니다.
2. **데이터 접근성**: 필요한 모든 트랜잭션 데이터를 단일 컬렉션에서 조회할 수 있어, 다중 컬렉션을 조인하거나 조합하는 과정이 불필요해질 수 있습니다.
3. **스키마 유연성**: MongoDB는 스키마리스(schema-less) 데이터베이스이므로, 다양한 형태의 트랜잭션 데이터를 하나의 컬렉션에 저장할 수 있습니다.

**단점**

1. **성능**: 하나의 컬렉션에 매우 큰 데이터셋이 저장되면, 읽기/쓰기 성능이 저하될 수 있습니다. 특히 인덱스가 많아지면 인덱스 관리 부담이 커집니다.
2. **스케일링 문제**: 하나의 컬렉션이 너무 커지면 샤딩을 통한 수평 확장이 어려워질 수 있습니다. 여러 작은 컬렉션으로 나누는 것이 오히려 더 효율적인 경우도 있습니다.
3. **데이터 관리**: 모든 데이터를 하나의 컬렉션에 저장하면 데이터 관리가 복잡해질 수 있습니다. 다양한 타입의 데이터가 섞여 있으면 데이터의 일관성을 유지하는 것이 어려울 수 있습니다.
4. **백업 및 복구**: 큰 컬렉션의 경우 백업과 복구 시간이 길어질 수 있습니다. 이는 운영 중인 시스템의 다운타임을 초래할 수 있습니다.

### 계층적 데이터 모델링 시 안티 패턴

계층적 데이터를 평면 컬렉션에 저장하는 것은 안티패턴으로 간주됩니다.  
계층적 데이터를 평면 컬렉션에 저장하면 계층적 형식으로 데이터를 검색하기 어려워지며, 관련 데이터를 검색하기 위해 여러 조인을 수행해야 합니다.  
또한, 평면 컬렉션은 데이터 중복 및 데이터 팽창을 초래할 수 있으며, 이는 저장 효율성과 쿼리 성능에 영향을 줄 수 있습니다.

#### 예시: 카테고리와 하위 카테고리

일반적으로 카테고리와 하위 카테고리 데이터는 계층적으로 저장됩니다.

```json
{
    "_id": "category1",
    "name": "Electronics",
    "subcategories": [
        { "name": "Laptops" },
        { "name": "Smartphones" }
    ]
}
```

이 데이터를 flat collection에 저장하면 다음과 같이 각 카테고리와 하위 카테고리를 별도로 저장하게 됩니다.

```js
// 카테고리 문서
{
    "_id": "category1",
    "name": "Electronics",
    "parent_id": null  // 최상위 카테고리는 부모가 없음
}

{
    "_id": "category2",
    "name": "Laptops",
    "parent_id": "category1"  // "Electronics"의 하위 카테고리
}

{
    "_id": "category3",
    "name": "Smartphones",
    "parent_id": "category1"  // "Electronics"의 하위 카테고리
}
```

이러한 방식으로 데이터를 저장하면 각 카테고리와 하위 카테고리가 동일한 컬렉션에 평면적으로 저장됩니다.  
이로 인해 다음과 같은 문제점이 발생할 수 있습니다:

1. **데이터 조회 복잡성**: 특정 카테고리의 모든 하위 카테고리를 조회하거나, 하위 카테고리의 상위 카테고리를 조회하기 위해 여러 번의 쿼리가 필요할 수 있습니다.
2. **데이터 중복**: 하위 카테고리를 표현하기 위해 중복된 데이터(`parent_id`)가 필요하게 됩니다.
3. **계층 구조 유지의 어려움**: 데이터가 많아질수록 계층 구조를 유지하고 관리하는 것이 복잡해질 수 있습니다.

따라서, MongoDB에서는 이러한 계층적 데이터를 저장할 때 중첩된 문서를 사용하는 것이 일반적이며, 평면 컬렉션에 저장하는 것은 주로 피하는 것이 좋습니다.

### Subset 패턴을 사용하기에 적합한 케이스

정답: 하나의 코스와 그 코스에 대한 최근 10개의 리뷰를 가져오는 케이스

특정 엔티티와 관련된 데이터의 하위 집합을 가져오고자 할 때 일반적으로 Subset Pattern(하위 집합 패턴)을 사용합니다.  
이 경우, 하나의 코스와 그에 대한 최근 10개의 리뷰를 가져오는 것은 코스 엔티티와 관련된 데이터의 하위 집합으로 간주될 수 있습니다.  
Subset Pattern을 사용하면 데이터 조회 과정을 최적화하고 불필요한 데이터 조회를 줄일 수 있습니다.

오답) 하나의 코스와 그 코스의 강사에 대한 정보를 가져오는 케이스 

코스와 강사에 대한 정보를 조회하는 것은 관련된 엔티티를 쿼리해야 할 수 있지만, 이는 Subset Pattern의 목적과 정확히 일치하지 않습니다.  
Subset Pattern은 특정 엔티티와 밀접하게 관련된 데이터의 하위 집합을 가져와야 할 때 더 적합하며, 여러 엔티티에서 정보를 조회하는 것과는 차이가 있습니다.

#### MongoDB Subset 패턴

MongoDB의 Subset 패턴은 특정 엔티티와 관련된 데이터의 일부분만을 저장하거나 조회하는 데 사용되는 패턴입니다. 대량의 관련 데이터를 다룰 때 성능 최적화를 위해 활용될 수 있습니다.

#### Subset 패턴이 사용되는 경우:

- **데이터 크기가 클 때**: 엔티티와 관련된 데이터가 너무 크면 이를 한 번에 모두 로드하는 것은 비효율적일 수 있습니다. Subset 패턴은 자주 사용되는 데이터의 일부만을 저장하거나 조회하여 불필요한 데이터 로드를 줄입니다.
- **특정 상황에서만 데이터가 필요한 경우**: 예를 들어, 사용자 인터페이스에서 최근 활동 10개만 보여주거나, 가장 인기 있는 리뷰만 표시해야 하는 경우 Subset 패턴을 사용하여 필요한 데이터만 빠르게 가져올 수 있습니다.

#### Subset 패턴의 구현 예시:

예를 들어, 하나의 코스에 수백 개의 리뷰가 있을 때 모든 리뷰를 저장하는 대신, 코스 문서 안에 최근 10개의 리뷰만을 하위 문서로 저장할 수 있습니다. 이렇게 하면 코스를 조회할 때 전체 리뷰를 가져올 필요 없이 자주 접근하는 최근 리뷰만을 빠르게 조회할 수 있습니다.

```js
{
    "_id": "course123",
    "title": "MongoDB Basics",
    "instructor": "John Doe",
    "recent_reviews": [
        { "user": "user1", "rating": 5, "comment": "Great course!" },
        { "user": "user2", "rating": 4, "comment": "Very informative." },
        // ...
    ]
}

```

#### Subset 패턴의 장점:

- **성능 최적화**: 불필요한 데이터를 로드하지 않기 때문에 응답 시간이 빨라지고 서버 리소스 사용이 줄어듭니다.
- **데이터 일관성**: 자주 사용하는 데이터만을 로드함으로써 데이터 일관성을 유지하고, 더 큰 데이터 세트를 필요할 때만 로드할 수 있습니다.

#### Subset 패턴의 단점:

- **데이터의 최신성**: 일부 데이터만을 저장하므로, 특정한 경우에 전체 데이터를 필요로 할 때 추가 쿼리가 필요할 수 있습니다.
- **복잡성 증가**: 데이터를 부분적으로 저장하고 처리해야 하므로, 데이터의 추가 관리가 필요할 수 있습니다.

### 비순차적 삽입

```js
db.collection.insertMany(
    [
        { _id: 1, name: "Alice" },
        { _id: 2, name: "Bob" },
        { _id: 3, name: "Charlie" },
        { _id: 1, name: "David" }  // _id가 1인 문서가 이미 있기 때문에 실패
    ],
    { ordered: false }
)
```

`"ordered": false` 옵션을 지정하여 insertMany 쿼리를 작성했다.  
비순차적 작업의 경우, MongoDB는 중복 키 오류와 같은 실패가 발생하더라도 나머지 문서들을 계속 처리합니다.

위 예시의 경우 세 개의 문서가 컬렉션에 삽입될 것입니다.
_id 값이 1("Alice"가 있는 첫 번째 문서), 2, 3인 문서들이 성공적으로 삽입될 것입니다.  
_id 값이 1인 두 번째 문서("David")는 중복 키 오류로 인해 삽입되지 않을 것이며, 작업이 비순차적으로 수행되기 때문에 오류가 발생한 후에도 나머지 문서들은 삽입될 수 있습니다.

### $expr 연산자

MongoDB에서 `$expr` 연산자는 쿼리 내에서 두 개 이상의 필드의 값을 비교하거나, 필드와 상수를 비교하거나, 산술 및 논리 연산을 수행할 수 있게 해줍니다.  
`$expr` 연산자는 일반적으로 MongoDB의 집계 파이프라인 단계에서 사용되는 연산자들을 쿼리 문서 내에서 사용할 수 있게 해줍니다.

#### `$expr` 연산자 사용 예시

1. **필드 간 비교**:
두 필드의 값이 동일한지 확인하고자 할 때, `$expr`을 사용할 수 있습니다.
    
    ```js
    db.companies.find({
        "$expr": {
            "$eq": ["$name", "$twitter_username"]
        }
    })
    
    ```
    
2. **필드와 상수 간 비교**:
필드의 값이 특정 상수 값과 동일한지 확인할 수 있습니다.
    
    ```js
    db.sales.find({
        "$expr": {
            "$gt": ["$amount", 1000]
        }
    })
    
    ```
    
3. **복잡한 논리 연산**:
여러 조건을 결합하여 복잡한 논리 연산을 수행할 수 있습니다.
    
    ```js
    db.orders.find({
        "$expr": {
            "$and": [
                { "$gt": ["$quantity", 100] },
                { "$lt": ["$price", 500] }
            ]
        }
    })
    
    ```
    
4. **산술 연산**:
필드의 값을 계산한 결과를 비교할 수 있습니다.
    
    ```js
    db.products.find({
        "$expr": {
            "$eq": [{ "$multiply": ["$price", "$quantity"] }, 10000]
        }
    })
    
    ```
    
    이 예시는 `price`와 `quantity` 필드를 곱한 결과가 10,000인 문서를 찾는 쿼리입니다.

### find.toArray()

find().toArray() 메서드는 컬렉션에서 모든 문서를 검색하여 배열 형식으로 변환하는 데 사용됩니다.  
toArray는 커서의 메서드로, 조회 결과를 배열 형태로 반환해준다.

### Array 타입의 목적

MongoDB에서 `"Array"` 데이터 타입은 서로 다른 데이터 타입을 가진 값들의 목록을 저장하는 데 사용됩니다.  
예를 들어, 문서의 배열 필드에는 문자열, 숫자 및 기타 데이터 타입이 혼합되어 저장될 수 있습니다.  
MongoDB는 문서 내의 필드들이 배열을 포함한 다양한 데이터 타입의 값을 가질 수 있도록 허용합니다.  
이러한 유연한 데이터 모델은 복잡한 데이터 구조를 저장할 때 더 큰 유연성을 제공합니다.