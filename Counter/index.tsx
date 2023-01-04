import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";

class CounterCtl {
  static async get(
    id: string
  ): Promise<{ documentId: string; ip: string; count: number }> {
    const data = await fetch(
      `https://ap-southeast-1.aws.data.mongodb-api.com/app/phrain-realm-wfzbv/endpoint/counter?id=${id}`
    ).then((res) => res.json());
    const { documentId, ip, count } = data;
    return {
      documentId,
      ip: (ip || "").toString().replace(/[_]/gi, "."),
      count: parseInt(count),
    };
  }
}

export const Counter = (props: { id?: string }) => {
  const [state, setState] = useState<{ loading: boolean; counter: number }>({
    loading: true,
    counter: 0,
  });

  useEffect(() => {
    if (props.id) {
      CounterCtl.get(props.id).then((data) => {
        setState((s) => ({ ...s, loading: false, counter: data.count }));
      });
    } else {
      setState((s) => ({ ...s, loading: false, counter: 0 }));
    }
  }, [props.id]);

  return <span className="KGCounter-root">
    {state.loading ? <Skeleton width={32} /> : state.counter}
  </span>;
};
